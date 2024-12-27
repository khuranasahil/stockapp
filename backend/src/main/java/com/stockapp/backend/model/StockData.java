package com.stockapp.backend.model;

import lombok.Data;
import java.util.List;

@Data
public class StockData {
    private Pagination pagination;
    private List<EODData> data;
}

@Data
class Pagination {
    private int limit;
    private int offset;
    private int count;
    private int total;
}

@Data
class EODData {
    private String symbol;
    private String exchange;
    private String date;
    private double open;
    private double high;
    private double low;
    private double close;
    private double volume;
    private double adj_high;
    private double adj_low;
    private double adj_close;
    private double adj_open;
    private double adj_volume;
    private double split_factor;
    private double dividend;
}
