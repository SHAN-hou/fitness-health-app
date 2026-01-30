package com.shanhou.fitnesshealthapp.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

val GreenPrimary = Color(0xFF4CAF50)
val GreenDark = Color(0xFF388E3C)
val GreenLight = Color(0xFFC8E6C9)
val White = Color(0xFFFFFFFF)
val LightGray = Color(0xFFF5F5F5)

private val LightColorScheme = lightColorScheme(
    primary = GreenPrimary,
    onPrimary = White,
    primaryContainer = GreenLight,
    secondary = GreenDark,
    background = LightGray,
    surface = White,
    onBackground = Color.Black,
    onSurface = Color.Black
)

private val DarkColorScheme = darkColorScheme(
    primary = GreenPrimary,
    onPrimary = White,
    primaryContainer = GreenDark,
    secondary = GreenLight,
    background = Color(0xFF121212),
    surface = Color(0xFF1E1E1E),
    onBackground = White,
    onSurface = White
)

@Composable
fun FitnessHealthAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
