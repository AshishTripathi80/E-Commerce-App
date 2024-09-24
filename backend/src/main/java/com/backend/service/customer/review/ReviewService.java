package com.backend.service.customer.review;

import com.backend.dto.OrderedProductResponseDto;
import com.backend.dto.ReviewDto;

import java.io.IOException;

public interface ReviewService {

    OrderedProductResponseDto getOrderedProductsDetailsByOrderId(Long orderId);

    ReviewDto giveReview(ReviewDto reviewDto) throws IOException ;
}
