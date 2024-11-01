package com.backend.service.customer.wishlist;

import com.backend.dto.WishListDto;
import com.backend.entity.Product;
import com.backend.entity.User;
import com.backend.entity.Wishlist;
import com.backend.repository.ProductRepository;
import com.backend.repository.UserRepository;
import com.backend.repository.WishListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishListServiceImpl implements WishListService {

    private final UserRepository userRepository;

    private final ProductRepository productRepository;

    private final WishListRepository wishListRepository;

    public WishListDto addProductToWishList(WishListDto wishListDto){
        Optional<Product> optionalProduct=productRepository.findById(wishListDto.getProductId());
        Optional<User> optionalUser= userRepository.findById(wishListDto.getUserId());

        if (optionalProduct.isPresent() && optionalUser.isPresent()){
            Wishlist wishlist = new Wishlist();
            wishlist.setProduct(optionalProduct.get());
            wishlist.setUser(optionalUser.get());

            return wishListRepository.save(wishlist).getWishlistDto();
        }
        return null;
    }

    public List<WishListDto> getWishListByUserId(Long userId){
        return wishListRepository.findAllByUserId(userId).stream().map(Wishlist::getWishlistDto)
                .collect(Collectors.toList());
    }
}
