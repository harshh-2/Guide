import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, TextInput, View, Text,KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from "react-native";
import { authStyles } from "../../../assets/styles/auth.styles";
import {Image} from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../../constants/colors";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async () => {
    const { error } = await signUp.password({
      emailAddress,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({
      code,
    });
    if (signUp.status === "complete") {
      await signUp.finalize({
        // Redirect the user to the home page after signing up
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
      // Check why the sign-up is not complete
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) {
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
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
                <Image source={require("../../../assets/images/cook.png")} style={authStyles.image} contentFit="contain" />
                </View>
                <Text style={[authStyles.title, { fontSize: 24, fontWeight: "700" }]}>Verify your account</Text>
                 <Text style={[authStyles.subtitle]}>We've sent a verification code at {emailAddress}</Text>
        <TextInput
          style={authStyles.textInput}
          value={code}
          placeholder="Enter your verification code"
          placeholderTextColor="#666666"
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
          onPress={() => signUp.verifications.sendEmailCode()}
        >
          <Text style={authStyles.link}>I need a new code</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
          onPress={async () => {
            try {
              // reset the sign-up attempt and navigate back to the sign-up form
              await signUp.reset();
            } catch (e) {
              // ignore if reset is not available or fails
              console.warn('signUp.reset() failed', e);
            }
            router.push('/sign-up');
          }}
        >
          <Text style={authStyles.link}>Edit email, go to sign up</Text>
        </Pressable>
        </ScrollView>
        </KeyboardAvoidingView>
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
             <Image source={require("../../../assets/images/sheep.png")} style={authStyles.image} contentFit="contain" />
             </View>
             <Text style={[authStyles.title, { fontSize: 24, fontWeight: "700" }]}>Welcome Back!</Text>
      <Text style={authStyles.title}>Sign up</Text>

      <Text style={authStyles.linkText}>Email address</Text>
      <TextInput
        style={authStyles.textInput}
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        placeholderTextColor="#666666"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        keyboardType="email-address"
      />
      {errors.fields.emailAddress && <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>}
      <Text style={authStyles.linkText}>Password</Text>
      <View style={authStyles.passwordContainer}>
      <TextInput
        style={authStyles.textInput}
        value={password}
        placeholder="Enter password"
        placeholderTextColor="#666666"
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
      color={COLORS.textSecondary}
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
        <Text style={authStyles.buttonText}>Sign up</Text>
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
        <Text>Already have an account? </Text>
        <Link href="/sign-in">
          <Text style={authStyles.link}>Sign in</Text>
        </Link>
      </View>

      {/* Required for sign-up flows. Clerk's bot sign-up protection is enabled by default */}
      <View nativeID="clerk-captcha" />
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
