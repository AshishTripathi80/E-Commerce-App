package com.backend.service.admin.category;

import com.backend.dto.CategoryDto;
import com.backend.entity.Category;

import java.util.List;

public interface CategoryService {

    Category createCategory(CategoryDto categoryDto);

    List<Category> getAllCategories();
}
