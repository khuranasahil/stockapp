package com.stockapp.backend.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class EODData {
    private String symbol;
    private String exchange;
    private String date;
    private double open;
    private double high;
    private double low;
    private double close;
    private double volume;
    @JsonProperty("adj_high")
    private double adjHigh;
    @JsonProperty("adj_low")
    private double adjLow;
    @JsonProperty("adj_close")
    private double adjClose;
    @JsonProperty("adj_open")
    private double adjOpen;
    @JsonProperty("adj_volume")
    private double adjVolume;
    @JsonProperty("split_factor")
    private double splitFactor;
    private double dividend;
}
