package com.backend.service.customer.wishlist;

import com.backend.dto.WishListDto;

import java.util.List;

public interface WishListService {

    WishListDto addProductToWishList(WishListDto wishListDto);

    List<WishListDto> getWishListByUserId(Long userId);
}
