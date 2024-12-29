package com.stockapp.backend;

import com.stockapp.backend.controller.StockController;
import com.stockapp.backend.model.StockData;
import com.stockapp.backend.service.StockService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.reactive.function.client.WebClient;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class StockControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StockService stockService;

    @MockBean
    private WebClient.Builder webClientBuilder;

    @Test
    public void healthCheckShouldReturn200() throws Exception {
        mockMvc.perform(get("/actuator/health"))
               .andExpect(status().isOk());
    }

    @Test
    public void getStockDataEndpointExists() throws Exception {
        StockData mockData = new StockData();
        when(stockService.getEodData(anyString())).thenReturn(mockData);
        
        mockMvc.perform(get("/api/stocks/eod")
               .param("symbols", "AAPL"))
               .andExpect(status().isOk());
    }
}
