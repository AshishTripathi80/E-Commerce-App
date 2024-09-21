package com.backend.service.admin.product;

import com.backend.dto.ProductDto;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;


public interface AdminProductService {

    ProductDto addProduct(ProductDto productDto) throws IOException;

    List<ProductDto> getAllProducts();

    List<ProductDto> getAllProductsByName(String name);

    boolean deleteProduct(Long id);

    ProductDto getProductById(Long productId);

    ProductDto updateProduct(Long productId, ProductDto productDto) throws IOException;
}
