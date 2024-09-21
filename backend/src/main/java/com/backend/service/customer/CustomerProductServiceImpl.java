package com.backend.service.customer;

import com.backend.dto.ProductDto;
import com.backend.entity.Product;
import com.backend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerProductServiceImpl implements CustomerProductService {

    private final ProductRepository productRepository;

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductsByName(String name) {
        List<Product> products = productRepository.findByNameContaining(name);
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }
}
