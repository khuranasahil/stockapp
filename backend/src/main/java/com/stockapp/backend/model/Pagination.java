package com.stockapp.backend.model;

import lombok.Data;

@Data
public class Pagination {
    private int limit;
    private int offset;
    private int count;
    private int total;
}
