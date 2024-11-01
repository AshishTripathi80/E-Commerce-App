package com.backend.service.customer;

import com.backend.dto.ProductDetailDto;
import com.backend.dto.ProductDto;
import com.backend.entity.FAQ;
import com.backend.entity.Product;
import com.backend.entity.Review;
import com.backend.repository.FAQRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerProductServiceImpl implements CustomerProductService {

    private final ProductRepository productRepository;

    private final FAQRepository faqRepository;

    private final ReviewRepository reviewRepository;

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public List<ProductDto> getAllProductsByName(String name) {
        List<Product> products = productRepository.findByNameContaining(name);
        return products.stream().map(Product::getDto).collect(Collectors.toList());
    }

    public ProductDetailDto getProductDetailById(Long productId){
        Optional<Product> optionalProduct=productRepository.findById(productId);
        if (optionalProduct.isPresent()){
            List<FAQ> faqList =faqRepository.findAllByProductId(productId);
            List<Review> reviewList=reviewRepository.findAllByProductId(productId);

            ProductDetailDto productDetailDto=new ProductDetailDto();
            productDetailDto.setProductDto(optionalProduct.get().getDto());
            productDetailDto.setFaqDtoList(faqList.stream().map(FAQ::getFAQDto).collect(Collectors.toList()));
            productDetailDto.setReviewDtoList(reviewList.stream().map(Review::getDto).collect(Collectors.toList()));

            return productDetailDto;
        }
        return null;
    }

}
