package org.sih.smriti;

import android.Manifest;
import android.content.pm.ActivityInfo;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import com.getcapacitor.BridgeActivity;
import java.util.Locale;

public class MainActivity extends BridgeActivity {
    private static final int RECORD_AUDIO_REQUEST_CODE = 2001;
    private TextToSpeech textToSpeech;
    private boolean isTtsInitialized = false;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Strictly lock screen orientation to portrait to prevent unwanted layout switching
        try {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
        } catch (Exception e) {
            android.util.Log.w("SmritiMainActivity", "Orientation lock notice: " + e.getMessage());
        }

        // Request runtime microphone permission if not already granted
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
                != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(
                this,
                new String[]{
                    Manifest.permission.RECORD_AUDIO,
                    Manifest.permission.MODIFY_AUDIO_SETTINGS
                },
                RECORD_AUDIO_REQUEST_CODE
            );
        }

        // Initialize Android Native Hardware Text-to-Speech Engine
        initNativeTTS();

        // Configure WebView media settings & attach Native TTS Bridge
        configureWebViewMedia();
    }

    private void initNativeTTS() {
        try {
            textToSpeech = new TextToSpeech(this, status -> {
                if (status == TextToSpeech.SUCCESS) {
                    isTtsInitialized = true;
                    if (textToSpeech != null) {
                        textToSpeech.setSpeechRate(0.88f); // Gentle geriatric tempo
                        textToSpeech.setPitch(1.02f);
                        textToSpeech.setLanguage(new Locale("en", "IN"));
                    }
                    android.util.Log.i("SmritiNativeTTS", "Android Native TTS engine initialized successfully");
                } else {
                    android.util.Log.w("SmritiNativeTTS", "TTS init returned status code: " + status);
                }
            });
        } catch (Exception e) {
            android.util.Log.e("SmritiNativeTTS", "TTS initialization failed: " + e.getMessage());
        }
    }

    @Override
    public void onResume() {
        super.onResume();
        configureWebViewMedia();
    }

    @Override
    public void onDestroy() {
        if (textToSpeech != null) {
            try {
                textToSpeech.stop();
                textToSpeech.shutdown();
            } catch (Exception ignored) {}
        }
        super.onDestroy();
    }

    private void configureWebViewMedia() {
        try {
            if (this.getBridge() != null && this.getBridge().getWebView() != null) {
                WebView webView = this.getBridge().getWebView();
                // Allow speech synthesis and audio to play smoothly without requiring synchronous user gesture
                webView.getSettings().setMediaPlaybackRequiresUserGesture(false);

                // Inject Native Hardware TTS Interface into WebView JavaScript context
                webView.addJavascriptInterface(new SmritiNativeTTSInterface(), "SmritiNativeTTS");
                android.util.Log.i("SmritiNativeTTS", "SmritiNativeTTS injected into WebView");
            }
        } catch (Exception e) {
            android.util.Log.w("SmritiMainActivity", "Media settings configuration notice: " + e.getMessage());
        }
    }

    /**
     * JavaScript Interface that bypasses Android WebView's disabled Web Speech API
     * and speaks directly through Android's hardware AudioTrack pipeline.
     */
    public class SmritiNativeTTSInterface {
        @JavascriptInterface
        public void speak(String text, String lang) {
            if (text == null || text.trim().isEmpty()) return;

            runOnUiThread(() -> {
                try {
                    if (textToSpeech != null && isTtsInitialized) {
                        Locale targetLocale;
                        if ("hi".equalsIgnoreCase(lang)) {
                            targetLocale = new Locale("hi", "IN");
                        } else if ("bn".equalsIgnoreCase(lang) || "as".equalsIgnoreCase(lang)) {
                            targetLocale = new Locale("bn", "IN");
                        } else {
                            targetLocale = new Locale("en", "IN");
                        }

                        int result = textToSpeech.setLanguage(targetLocale);
                        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                            textToSpeech.setLanguage(new Locale("en", "IN"));
                        }

                        textToSpeech.speak(text, TextToSpeech.QUEUE_FLUSH, null, "SmritiUtterance_" + System.currentTimeMillis());
                        android.util.Log.d("SmritiNativeTTS", "Speaking text natively: " + text.substring(0, Math.min(text.length(), 40)));
                    }
                } catch (Exception e) {
                    android.util.Log.e("SmritiNativeTTS", "Speech execution error: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public void stop() {
            runOnUiThread(() -> {
                try {
                    if (textToSpeech != null) {
                        textToSpeech.stop();
                    }
                } catch (Exception e) {
                    android.util.Log.e("SmritiNativeTTS", "TTS stop error: " + e.getMessage());
                }
            });
        }

        @JavascriptInterface
        public boolean isAvailable() {
            return isTtsInitialized;
        }
    }
}
