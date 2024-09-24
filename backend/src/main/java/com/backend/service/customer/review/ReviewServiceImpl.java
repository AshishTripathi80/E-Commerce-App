package com.backend.service.customer.review;

import com.backend.dto.OrderedProductResponseDto;
import com.backend.dto.ProductDto;
import com.backend.dto.ReviewDto;
import com.backend.entity.*;
import com.backend.repository.OrderRepository;
import com.backend.repository.ProductRepository;
import com.backend.repository.ReviewRepository;
import com.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{

    private final OrderRepository orderRepository;

    private final ProductRepository productRepository;

    private final UserRepository userRepository;

    private final ReviewRepository reviewRepository;

    public OrderedProductResponseDto getOrderedProductsDetailsByOrderId( Long orderId){
        Optional<Order> optionalOrder =orderRepository.findById(orderId);
        OrderedProductResponseDto orderedProductResponseDto=new OrderedProductResponseDto();
        if (optionalOrder.isPresent()){
            orderedProductResponseDto.setOrderAmount(optionalOrder.get().getAmount());

            List<ProductDto> productDtoList=new ArrayList<>();
            for (CartItem cartItem : optionalOrder.get().getCartItems()){
                ProductDto productDto= new ProductDto();

                productDto.setId(cartItem.getProduct().getId());
                productDto.setName(cartItem.getProduct().getName());
                productDto.setPrice(cartItem.getPrice());
                productDto.setQuantity(cartItem.getQuantity());
                productDto.setByteImg(cartItem.getProduct().getImg());

                productDtoList.add(productDto);
            }
            orderedProductResponseDto.setProductDtoList(productDtoList);
        }
        return orderedProductResponseDto;
    }

    public ReviewDto giveReview(ReviewDto reviewDto) throws IOException{
        Optional<Product> optionalProduct=productRepository.findById(reviewDto.getProductId());
        Optional<User> optionalUser=userRepository.findById(reviewDto.getUserId());

        if (optionalUser.isPresent() && optionalProduct.isPresent()){
            Review review= new Review();
            review.setRating(review.getRating());
            review.setDescription(review.getDescription());
            review.setUser(optionalUser.get());
            review.setProduct(optionalProduct.get());
            review.setImg(reviewDto.getImg().getBytes());

            return reviewRepository.save(review).getDto();
        }
        return null;
    }


}
