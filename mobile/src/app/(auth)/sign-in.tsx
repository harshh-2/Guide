import { useSignIn } from "@clerk/expo";
import { type Href, Icon, Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, TextInput, View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { authStyles } from "../../../assets/styles/auth.styles";
import { COLORS } from "../../../constants/colors";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
export default function Page() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
const [showPassword, setShowPassword] = React.useState(false);
  const handleSubmit = async () => {
    const { error } = await signIn.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else if (signIn.status === "needs_second_factor") {
      // See https://clerk.com/docs/guides/development/custom-flows/authentication/multi-factor-authentication
    } else if (signIn.status === "needs_client_trust") {
      // For other second factor strategies,
      // see https://clerk.com/docs/guides/development/custom-flows/authentication/client-trust
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );

      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            // Handle pending session tasks
            // See https://clerk.com/docs/guides/development/custom-flows/authentication/session-tasks
            console.log(session?.currentTask);
            return;
          }

          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      // Check why the sign-in is not complete
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  if (signIn.status === "needs_client_trust") {
    return (
      <View style={authStyles.container}>
        <Text style={[authStyles.title, { fontSize: 24, fontWeight: "bold" }]}>Verify your account</Text>
        <TextInput
          style={[
            authStyles.textInput,
            { backgroundColor: COLORS.background, color: COLORS.text },
          ]}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor={COLORS.textLight}
          onChangeText={(code) => setCode(code)}
          keyboardType="numeric"
        />
        {errors.fields.code && <Text style={styles.error}>{errors.fields.code.message}</Text>}
        <Pressable
          style={({ pressed }) => [
            authStyles.authButton,
            fetchStatus === "fetching" && authStyles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleVerify}
          disabled={fetchStatus === "fetching"}
        >
          <Text style={authStyles.buttonText}>Verify</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.mfa.sendEmailCode()}
        >
          <Text style={authStyles.link}>I need a new code</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={() => signIn.reset()}
        >
          <Text style={authStyles.link}>Start over</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={authStyles.container}>
      <KeyboardAvoidingView
        style={authStyles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        >
        <ScrollView contentContainerStyle={authStyles.scrollContent}
          showsVerticalScrollIndicator={false}>
                  <View style={authStyles.imageContainer}>
        <Image source={require("../../../assets/images/racoon.png")} style={authStyles.image} contentFit="contain" />
        </View>
        <Text style={[authStyles.title, { fontSize: 24, fontWeight: "700" }]}>Welcome Back!</Text>
      <Text style={[authStyles.title, { fontSize: 24, fontWeight: "700" }]}>Sign in</Text>
      <Text style={authStyles.linkText}>Email address</Text>
      <TextInput
        style={[authStyles.textInput, { backgroundColor: COLORS.background, color: COLORS.text }]}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor={COLORS.textLight}
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
      {errors.fields.identifier && <Text style={styles.error}>{errors.fields.identifier.message}</Text>}
      <Text style={authStyles.linkText}>Password</Text>
     <View style={authStyles.formContainer}>
  <TextInput
    style={[
      authStyles.textInput,
      authStyles.textInput,
      {
        backgroundColor: COLORS.background,
        color: COLORS.text,
      },
    ]}
    value={password}
    placeholder="Enter password"
    placeholderTextColor={COLORS.textLight}
    secureTextEntry={!showPassword}
    onChangeText={(password) => setPassword(password)}
  />

  <TouchableOpacity
    style={authStyles.eyeButton}
    onPress={() => setShowPassword(!showPassword)}
  >
    <Ionicons
      name={showPassword ? "eye-outline" : "eye-off-outline"}
      size={22}
      color={COLORS.textLight}
    />
  </TouchableOpacity>
</View>
      {errors.fields.password && <Text style={styles.error}>{errors.fields.password.message}</Text>}
      <Pressable
        style={({ pressed }) => [
          authStyles.authButton,
          (!emailAddress || !password || fetchStatus === "fetching") && authStyles.buttonDisabled,
          pressed && styles.buttonPressed,
        ]}
        onPress={handleSubmit}
        disabled={!emailAddress || !password || fetchStatus === "fetching"}
      >
        <Text style={authStyles.buttonText}>Continue</Text>
      </Pressable>
      {/* Show only helpful error messages instead of raw JSON */}
      {errors && (
        <View>
          {errors.fields &&
            Object.entries(errors.fields).map(([key, value]) =>
              value && (value as any).message ? (
                    <Text key={key} style={styles.error}>{key}: {(value as any).message}</Text>
              ) : null,
            )}

          {errors.global && (
            <Text style={styles.error}>{String(errors.global)}</Text>
          )}
        </View>
      )}

      <View style={authStyles.linkContainer}>
        <Text>Don&apos;t have an account? </Text>
        <Link href="/sign-up">
          <Text style={authStyles.link}>Sign up</Text>
        </Link>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#0a7ea4",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  secondaryButtonText: {
    color: "#0a7ea4",
    fontWeight: "600",
  },
  linkContainer: {
    flexDirection: "row",
    marginTop: 12,
    alignItems: "center",
  },
  error: {
    color: "#d32f2f",
    fontSize: 12,
    marginTop: -8,
  },
  debug: {
    fontSize: 10,
    opacity: 0.5,
    marginTop: 8,
  },
});
