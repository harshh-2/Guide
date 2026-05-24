import { Show, useUser } from '@clerk/expo'
import { useClerk } from '@clerk/expo'
import { Link } from 'expo-router'
import { Text, View, Pressable, StyleSheet } from 'react-native'
import {homeStyles} from "../../../assets/styles/home.styles";
export default function Page() {
  const { user } = useUser()
  const { signOut } = useClerk()

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Welcome!</Text>
      <Show when="signed-out">
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </Show>
      <Show when="signed-in">
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Pressable style={styles. categoryButton} onPress={() => signOut()}>
          <Text style={styles.categoryText}>Sign out</Text>
        </Pressable>
      </Show>
    </View>
  )
}

const styles = homeStyles;