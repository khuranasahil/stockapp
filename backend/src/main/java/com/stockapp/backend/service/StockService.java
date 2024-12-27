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
                .onStatus(status -> status.is4xxClientError(),
                    response -> response.bodyToMono(String.class)
                        .flatMap(error -> {
                            System.err.println("Client Error Response: " + error);
                            return Mono.error(new RuntimeException("Client Error: " + error));
                        }))
                .onStatus(status -> status.is5xxServerError(),
                    response -> response.bodyToMono(String.class)
                        .flatMap(error -> {
                            System.err.println("Server Error Response: " + error);
                            return Mono.error(new RuntimeException("Server Error: " + error));
                        }))
                .bodyToMono(StockData.class)
                .doOnNext(data -> System.out.println("Received response: " + data))
                .doOnError(error -> System.err.println("Error fetching stock data: " + error.getMessage()))
                .block();
        } catch (Exception e) {
            System.err.println("Exception in getEodData: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to fetch stock data", e);
        }
    }
}
