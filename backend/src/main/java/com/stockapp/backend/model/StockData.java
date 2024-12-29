package com.stockapp.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class StockData {
    private Pagination pagination;
    private List<EODData> data;
}
