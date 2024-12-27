package com.stockapp.backend.service;

import com.stockapp.backend.model.StockData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class StockService {
    private final WebClient.Builder webClientBuilder;
    
    @Value("${marketstack.api.key}")
    private String apiKey;
    
    @Value("${marketstack.api.url}")
    private String apiUrl;

    public StockData getEodData(String symbols) {
        String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
            .path("/eod")
            .queryParam("access_key", apiKey)
            .queryParam("symbols", symbols)
            .build()
            .toUriString();
            
        System.out.println("Calling MarketStack API: " + url);
        
        try {
            return webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .doOnNext(rawResponse -> {
                    System.out.println("Raw API Response: " + rawResponse);
                })
                .map(rawResponse -> {
                    try {
                        return new com.fasterxml.jackson.databind.ObjectMapper().readValue(rawResponse, StockData.class);
                    } catch (Exception e) {
                        System.err.println("Error parsing response: " + e.getMessage());
                        System.err.println("Raw response: " + rawResponse);
                        throw new RuntimeException("Failed to parse API response", e);
                    }
                })
                .doOnNext(response -> {
                    System.out.println("Successfully parsed response with " + 
                        (response.getData() != null ? response.getData().size() : 0) + 
                        " stock entries");
                })
                .doOnError(error -> {
                    System.err.println("Error fetching stock data: " + error.getMessage());
                    if (error instanceof org.springframework.web.reactive.function.client.WebClientResponseException) {
                        org.springframework.web.reactive.function.client.WebClientResponseException webError = 
                            (org.springframework.web.reactive.function.client.WebClientResponseException) error;
                        System.err.println("Response body: " + webError.getResponseBodyAsString());
                    }
                })
                .block();
        } catch (Exception e) {
            System.err.println("Exception in getEodData: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch stock data", e);
        }
    }
}
