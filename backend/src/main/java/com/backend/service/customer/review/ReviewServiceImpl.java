package com.backend.service.customer.review;

import com.backend.dto.OrderedProductResponseDto;
import com.backend.dto.ProductDto;
import com.backend.entity.CartItem;
import com.backend.entity.Order;
import com.backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{

    private final OrderRepository orderRepository;

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
}
