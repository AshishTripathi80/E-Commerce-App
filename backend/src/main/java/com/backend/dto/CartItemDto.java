package com.backend.dto;


import lombok.Data;

@Data
public class CartItemDto {

    private Long id;

    private Long price;

    private Long quantity;

    private Long productId;

    private Long orderId;

    private String productName;

    private byte[] returnedImg;

    private Long userId;
}
