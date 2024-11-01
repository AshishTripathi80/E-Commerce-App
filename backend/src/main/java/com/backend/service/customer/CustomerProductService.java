package com.backend.service.customer;

import com.backend.dto.ProductDetailDto;
import com.backend.dto.ProductDto;

import java.util.List;

public interface CustomerProductService {

    List<ProductDto> getAllProducts();

    List<ProductDto> getAllProductsByName(String name);

    ProductDetailDto getProductDetailById(Long productId);
}
