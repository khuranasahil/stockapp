package com.stockapp.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stockapp.backend.model.StockData;
import com.stockapp.backend.model.EODData;
import com.stockapp.backend.model.Pagination;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StockService {
    private final WebClient.Builder webClientBuilder;
    
    @Value("${alphavantage.api.key}")
    private String apiKey;
    
    @Value("${alphavantage.api.url}")
    private String apiUrl;

    public StockData getEodData(String symbols) {
        List<EODData> allData = new ArrayList<>();
        String[] symbolArray = symbols.split(",");
        
        for (String symbol : symbolArray) {
            String url = UriComponentsBuilder.fromHttpUrl(apiUrl)
                .queryParam("function", "TIME_SERIES_MONTHLY")
                .queryParam("symbol", symbol.trim())
                .queryParam("apikey", apiKey)
                .build()
                .toUriString();
                
            System.out.println("Calling AlphaVantage API for symbol " + symbol + ": " + url);
            
            try {
                String response = webClientBuilder.build()
                    .get()
                    .uri(url)
                    .retrieve()
                    .bodyToMono(String.class)
                    .doOnNext(rawResponse -> {
                        System.out.println("Raw API Response for " + symbol + ": " + rawResponse);
                    })
                    .block();

                ObjectMapper mapper = new ObjectMapper();
                JsonNode rootNode = mapper.readTree(response);
                
                // Check for API limit message
                JsonNode infoNode = rootNode.get("Information");
                if (infoNode != null && infoNode.asText().contains("API rate limit")) {
                    throw new RuntimeException("API rate limit reached: " + infoNode.asText());
                }
                
                JsonNode timeSeries = rootNode.get("Monthly Time Series");
                
                if (timeSeries != null) {
                    Iterator<Map.Entry<String, JsonNode>> fields = timeSeries.fields();
                    while (fields.hasNext()) {
                        Map.Entry<String, JsonNode> entry = fields.next();
                        String date = entry.getKey();
                        JsonNode data = entry.getValue();
                        
                        EODData eodData = new EODData();
                        eodData.setSymbol(symbol);
                        eodData.setDate(date);
                        eodData.setOpen(Double.parseDouble(data.get("1. open").asText()));
                        eodData.setHigh(Double.parseDouble(data.get("2. high").asText()));
                        eodData.setLow(Double.parseDouble(data.get("3. low").asText()));
                        eodData.setClose(Double.parseDouble(data.get("4. close").asText()));
                        eodData.setVolume(Double.parseDouble(data.get("5. volume").asText()));
                        
                        allData.add(eodData);
                    }
                }
            } catch (Exception e) {
                System.err.println("Error fetching data for symbol " + symbol + ": " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        StockData stockData = new StockData();
        stockData.setData(allData);
        
        Pagination pagination = new Pagination();
        pagination.setCount(allData.size());
        pagination.setTotal(allData.size());
        stockData.setPagination(pagination);
        
        return stockData;
    }
}
