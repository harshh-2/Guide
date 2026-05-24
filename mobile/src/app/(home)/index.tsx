import { Show, useUser } from '@clerk/expo'
import { useClerk } from '@clerk/expo'
import { Link, useRouter } from 'expo-router'
import { Text, View, Pressable, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, FlatList } from 'react-native'
import {homeStyles} from "../../../assets/styles/home.styles";
import { useEffect, useState } from 'react';
import { MealAPI } from '../../../services/mealAPI';
import { Image } from 'expo-image';
import { COLORS } from '../../../constants/colors';
import Ionicons from '@expo/vector-icons/build/Ionicons';
import  CategoryFilter from '../../../components/CategoryFilter';
import RecipeCard from '../../../components/RecipeCard';
import LoadingSpinner from '../../../components/LoadingSpinner';
export default function Page() {

const router = useRouter();
const [selectedCategory, setSelectedCategory] = useState("Dessert");
const [recipes, setRecipes] = useState<any[]>([]);
const [categories, setCategories] = useState<any[]>([]);
const [featuredRecipe, setFeaturedRecipe] = useState<any | null>(null);
const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);
const loadData = async () => {
  setLoading(true);
  try {
    const [fetchedCategories, fetchedRecipes, fetchedFeatured] = await Promise.all([
      MealAPI.getCategories(),
      MealAPI.getRandomMeals(12),
      MealAPI.getRandomMeal()
    ]);
   const transformedCategories = (fetchedCategories as any[]).map((cat: any, index: number) => ({
    id: index + 1,
    name: cat.strCategory,
    image: cat.strCategoryThumb,
    description: cat.strCategoryDescription,
    }));
    setCategories(transformedCategories);
    if(!selectedCategory) {
      setSelectedCategory(transformedCategories[2].name);
    }
    const transformedMeals = (fetchedRecipes as any[])
      .map((meal: any) => MealAPI.transformMealData(meal))
      .filter((meal: any) => meal !== null);
    setRecipes(transformedMeals as any[]);
    const transformedFeatured = MealAPI.transformMealData(fetchedFeatured as any);
    setFeaturedRecipe(transformedFeatured as any);
  }
    catch (error) {
        console.error("Error loading data:", error);
    }
    finally {
      setLoading(false);
    }
  }

    const loadCategoryData = async (category: string) => {
    try {
    const meals = await MealAPI.filterByCategory(category);
    const transformedMeals = (meals as any[])
      .map((meal: any) => MealAPI.transformMealData(meal))
      .filter((meal: any) => meal !== null);
    setRecipes(transformedMeals);
}   catch (error) {
    console.error("Error loading category data:", error);
    setRecipes([]);
  }
};
const handleCategoryPress = async (category: string) => {
    setSelectedCategory(category);
    await loadCategoryData(category);
  };
const onRefresh = async () => {
    setRefreshing(true);
    // await sleep(2000);
    await loadData();
    setRefreshing(false);
  };
useEffect(() => {
    loadData();
    }, []);
if (loading && !refreshing) return <LoadingSpinner message="Loading recipes..." />;
  return (
    <View style={styles.container}>
        <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary}/>
        }
        contentContainerStyle={styles.scrollContent}
        >
        
         <View style={styles.welcomeSection}>
            <Image source={require("../../../assets/images/chick.png")} style={{width:100 ,height:100}} />
             <Image source={require("../../../assets/images/Veggie.png")} style={{width:100 ,height:100}} />
              <Image source={require("../../../assets/images/cat.png")} style={{width:100 ,height:100}} />
        </View>
        {/* Featured Recipe */}
        {featuredRecipe && <View style={styles.featuredSection}>
            <TouchableOpacity
            style={styles.featuredCard}
            activeOpacity={0.9}
            onPress={() => router.push((`/recipe/${(featuredRecipe as any).id}`) as any)}
            >
            <View style={styles.featuredImageContainer}>
            <Image source={{ uri: featuredRecipe.image }} style={styles.featuredImage} contentFit="cover" transition={500} />
            <View style={styles.featuredOverlay}>
                <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>Featured</Text>
            </View>
            <View style={styles.featuredContent}>
            <Text style={styles.featuredTitle} numberOfLines={2}>
              {featuredRecipe.title}
            </Text>
            <View style={homeStyles.featuredMeta}>
  <View style={homeStyles.metaItem}>
    <Ionicons name="time-outline" size={16} color={COLORS.white} />
    <Text style={homeStyles.metaText}>
      {featuredRecipe.cookTime}
    </Text>
  </View>

  <View style={homeStyles.metaItem}>
    <Ionicons name="people-outline" size={16} color={COLORS.white} />
    <Text style={homeStyles.metaText}>
      {featuredRecipe.servings}
    </Text>
  </View>

  {featuredRecipe.area && (
    <View style={homeStyles.metaItem}>
      <Ionicons
        name="location-outline"
        size={16}
        color={COLORS.white}
      />
      <Text style={homeStyles.metaText}>
        {featuredRecipe.area}
      </Text>
    </View>
  )}

</View>
            </View>
            </View>
            </View>
            </TouchableOpacity>
            </View>
        }

        {/* Categories */}
        {categories.length > 0 && (<CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryPress}
        />)}

         <View style={homeStyles.recipesSection}>
          <View style={homeStyles.sectionHeader}>
            <Text style={homeStyles.sectionTitle}>{selectedCategory}</Text>
          </View>

          {recipes.length > 0 ? (
            <FlatList
              data={recipes}
              renderItem={({ item }) => <RecipeCard recipe={item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={homeStyles.row}
              contentContainerStyle={homeStyles.recipesGrid}
              scrollEnabled={false}
              // ListEmptyComponent={}
            />
          ) : (
            <View style={homeStyles.emptyState}>
              <Ionicons name="restaurant-outline" size={64} color={COLORS.textLight} />
              <Text style={homeStyles.emptyTitle}>No recipes found</Text>
              <Text style={homeStyles.emptyDescription}>Try a different category</Text>
            </View>
          )}
        </View>
        
        </ScrollView>

    </View>
  )
}

const styles = homeStyles;