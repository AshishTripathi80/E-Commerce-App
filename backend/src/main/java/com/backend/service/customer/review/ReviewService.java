package com.backend.service.customer.review;

import com.backend.dto.OrderedProductResponseDto;

public interface ReviewService {

    OrderedProductResponseDto getOrderedProductsDetailsByOrderId(Long orderId);
}
