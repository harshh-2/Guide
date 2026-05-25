import { Show, useUser, useClerk } from "@clerk/expo";
import { Link, router } from "expo-router";
import {
  Text,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useEffect, useState } from "react";

import { homeStyles } from "../../../assets/styles/home.styles";
import { API_URL } from "../../../constants/api";
import { COLORS } from "../../../constants/colors";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const displayName =
  user?.primaryEmailAddress?.emailAddress?.split("@")[0];
  const [favoritesCount, setFavoritesCount] = useState(0);

  useEffect(() => {
    const fetchFavoritesCount = async () => {
      try {
        if (!user) return;

        const response = await fetch(
          `${API_URL}/favorites/${user.id}`
        );

        const data = await response.json();

        setFavoritesCount(data.length);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFavoritesCount();
  }, [user]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>
          Account Settings
        </Text>
      </View>

      <Show when="signed-out">
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>

        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </Show>

      <Show when="signed-in">
        <View
          style={[
            styles.featuredCard,
            {
              marginHorizontal: 20,
              padding: 22,
              backgroundColor: COLORS.card,
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 40,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: COLORS.shadow,
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  color: COLORS.white,
                  fontSize: 28,
                  fontWeight: "800",
                }}
              >
                {user?.firstName?.charAt(0) || "U"}
              </Text>
            </View>

            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text
                style={{
                  color: COLORS.text,
                  fontSize: 24,
                  fontWeight: "800",
                }}
              >
                {displayName || "User"}
              </Text>

              <Text
                style={{
                  color: COLORS.textLight,
                  marginTop: 6,
                  fontSize: 14,
                }}
              >
                {
                  user?.primaryEmailAddress
                    ?.emailAddress
                }
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: COLORS.border,
              marginBottom: 20,
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
              gap: 12,
            }}
          >
            <TouchableOpacity
  style={{
    flex: 1,
    backgroundColor: COLORS.background,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: "center",
  }}
  onPress={() =>
    router.push("/(home)/favorites")
  }
>
  <Text
    style={{
      color: COLORS.primary,
      fontSize: 24,
      fontWeight: "800",
    }}
  >
    {favoritesCount}
  </Text>

  <Text
    style={{
      color: COLORS.textLight,
      marginTop: 6,
      fontSize: 13,
    }}
  >
    Favorites
  </Text>
</TouchableOpacity>
            <View
              style={{
                flex: 1,
                backgroundColor: COLORS.background,
                paddingVertical: 18,
                borderRadius: 18,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: COLORS.primary,
                  fontSize: 20,
                  fontWeight: "800",
                }}
              >
                {user?.createdAt
                  ? new Date(
                      user.createdAt
                    ).getFullYear()
                  : "N/A"}
              </Text>

              <Text
                style={{
                  color: COLORS.textLight,
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                Joined
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: COLORS.background,
              borderRadius: 20,
              padding: 18,
              gap: 14,
            }}
          >
            <Text
              style={{
                color: COLORS.text,
                fontSize: 18,
                fontWeight: "700",
                marginBottom: 6,
              }}
            >
              Account Details
            </Text>

            <Text
              style={{
                color: COLORS.textLight,
                fontSize: 14,
              }}
            >
              Email:{" "}
              {
                user?.primaryEmailAddress
                  ?.emailAddress
              }
            </Text>

            <Text
              style={{
                color: COLORS.textLight,
                fontSize: 14,
              }}
            >
              Phone:{" "}
              {user?.phoneNumbers[0]
                ?.phoneNumber || "Not Added"}
            </Text>

            <Text
              style={{
                color: COLORS.textLight,
                fontSize: 14,
              }}
            >
              Member Since:{" "}
              {user?.createdAt
                ? new Date(
                    user.createdAt
                  ).toDateString()
                : "N/A"}
            </Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20 ,marginTop: 30}}>
          <Pressable
            style={styles.categoryButton}
            onPress={async () => {
              await signOut();
              router.replace("/(auth)/sign-in");
            }}
          >
            <Text style={styles.categoryText}>
              Sign out
            </Text>
          </Pressable>
        </View>
      </Show>
    </ScrollView>
  );
}

const styles = homeStyles;