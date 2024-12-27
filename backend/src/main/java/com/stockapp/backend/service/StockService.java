package com.stockapp.backend.service;

import com.stockapp.backend.model.StockData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
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
        return webClientBuilder.build()
            .get()
            .uri(apiUrl + "/eod?access_key=" + apiKey + "&symbols=" + symbols)
            .retrieve()
            .bodyToMono(StockData.class)
            .block();
    }
}
