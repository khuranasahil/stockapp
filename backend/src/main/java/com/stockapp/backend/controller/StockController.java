package com.stockapp.backend.controller;

import com.stockapp.backend.model.StockData;
import com.stockapp.backend.service.StockService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
// Removed @CrossOrigin annotation in favor of global CORS configuration
public class StockController {
    private final StockService stockService;

    @GetMapping("/eod")
    public StockData getEodData(@RequestParam String symbols) {
        return stockService.getEodData(symbols);
    }
}
