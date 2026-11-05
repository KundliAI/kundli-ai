import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'tokens.g.dart';

/// Sidera colours on the theme, so widgets read `context.c.card` etc.
class SideraTheme extends ThemeExtension<SideraTheme> {
  const SideraTheme(this.c);
  final SideraColors c;

  @override
  SideraTheme copyWith({SideraColors? c}) => SideraTheme(c ?? this.c);

  @override
  SideraTheme lerp(covariant SideraTheme? other, double t) => t < 0.5 ? this : (other ?? this);
}

extension SideraContext on BuildContext {
  SideraColors get c => Theme.of(this).extension<SideraTheme>()!.c;
  TextTheme get text => Theme.of(this).textTheme;
}

ThemeData buildTheme(Brightness b) {
  final c = b == Brightness.light ? SideraColors.light : SideraColors.dark;
  final base = ThemeData(brightness: b, useMaterial3: true);
  final latin = base.textTheme.apply(fontFamily: GoogleFonts.manrope().fontFamily);
  final fallback = [GoogleFonts.notoSansDevanagari().fontFamily!];
  TextStyle t(TextStyle? s, double size, FontWeight w, {double ls = 0, double h = 1.4}) =>
      (s ?? const TextStyle()).copyWith(
        fontSize: size, fontWeight: w, letterSpacing: ls, height: h, color: c.ink, fontFamilyFallback: fallback);

  final text = latin.copyWith(
    displaySmall: t(latin.displaySmall, SideraSize.h1, FontWeight.w500, ls: -1.2, h: 1.1),
    headlineMedium: t(latin.headlineMedium, 32, FontWeight.w500, ls: -0.9, h: 1.12),
    headlineSmall: t(latin.headlineSmall, SideraSize.h2, FontWeight.w500, ls: -0.7, h: 1.15),
    titleLarge: t(latin.titleLarge, SideraSize.h3, FontWeight.w500, ls: -0.3, h: 1.25),
    titleMedium: t(latin.titleMedium, SideraSize.body, FontWeight.w600),
    bodyLarge: t(latin.bodyLarge, SideraSize.body, FontWeight.w400, h: 1.55),
    bodyMedium: t(latin.bodyMedium, SideraSize.small + 1, FontWeight.w400, h: 1.5),
    bodySmall: t(latin.bodySmall, SideraSize.small, FontWeight.w400).copyWith(color: c.inkMuted),
    labelLarge: t(latin.labelLarge, 15, FontWeight.w600),
    labelSmall: t(latin.labelSmall, SideraSize.label, FontWeight.w500, ls: 1),
  );

  final pill = RoundedRectangleBorder(borderRadius: BorderRadius.circular(SideraRadius.pill));
  return base.copyWith(
    scaffoldBackgroundColor: c.bg,
    colorScheme: ColorScheme(
      brightness: b, primary: c.accent, onPrimary: c.onAccent, secondary: c.card, onSecondary: c.cardInk,
      error: c.danger, onError: c.bg, surface: c.bg, onSurface: c.ink, onSurfaceVariant: c.inkMuted,
      surfaceContainerLowest: c.bg, surfaceContainerLow: c.surface, surfaceContainer: c.surface,
      surfaceContainerHigh: c.surface, surfaceContainerHighest: c.surfaceStrong, surfaceTint: Colors.transparent,
      outline: c.line, outlineVariant: c.line,
    ),
    textTheme: text,
    extensions: [SideraTheme(c)],
    splashFactory: InkSparkle.splashFactory,
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        backgroundColor: c.accent, foregroundColor: c.onAccent, minimumSize: const Size(48, 52),
        padding: const EdgeInsets.symmetric(horizontal: SideraSpace.s6), shape: pill, textStyle: text.labelLarge,
        disabledBackgroundColor: c.accent.withValues(alpha: 0.4), disabledForegroundColor: c.onAccent.withValues(alpha: 0.6),
      ),
    ),
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: c.ink, minimumSize: const Size(48, 52), shape: pill, textStyle: text.labelLarge,
        padding: const EdgeInsets.symmetric(horizontal: SideraSpace.s6),
        side: BorderSide(color: c.ink.withValues(alpha: 0.28)),
      ),
    ),
    textButtonTheme: TextButtonThemeData(style: TextButton.styleFrom(foregroundColor: c.ink, textStyle: text.labelLarge)),
    inputDecorationTheme: InputDecorationTheme(
      filled: true, fillColor: c.surface,
      contentPadding: const EdgeInsets.symmetric(horizontal: SideraSpace.s5, vertical: 16),
      hintStyle: TextStyle(color: c.ink.withValues(alpha: 0.45)),
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(SideraRadius.md), borderSide: BorderSide(color: c.line)),
      enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(SideraRadius.md), borderSide: BorderSide(color: c.line)),
      focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(SideraRadius.md), borderSide: BorderSide(color: c.accent, width: 2)),
      errorStyle: TextStyle(color: c.danger),
    ),
    chipTheme: ChipThemeData(
      color: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? c.card : Colors.transparent),
      backgroundColor: Colors.transparent, selectedColor: c.card, labelStyle: text.bodyMedium?.copyWith(fontWeight: FontWeight.w500),
      secondaryLabelStyle: text.bodyMedium?.copyWith(color: c.cardInk, fontWeight: FontWeight.w500),
      side: BorderSide(color: c.ink.withValues(alpha: 0.24)), shape: pill, showCheckmark: false,
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 8),
    ),
    navigationBarTheme: NavigationBarThemeData(
      backgroundColor: c.bg, indicatorColor: c.card, elevation: 0, height: 68,
      iconTheme: WidgetStateProperty.resolveWith((s) => IconThemeData(color: s.contains(WidgetState.selected) ? c.cardInk : c.inkMuted)),
      labelTextStyle: WidgetStateProperty.resolveWith((s) => text.labelSmall!.copyWith(
        letterSpacing: 0, color: s.contains(WidgetState.selected) ? c.ink : c.inkMuted)),
    ),
    dividerColor: c.line,
    checkboxTheme: CheckboxThemeData(fillColor: WidgetStateProperty.resolveWith((s) => s.contains(WidgetState.selected) ? c.accentStrong : null)),
    snackBarTheme: SnackBarThemeData(backgroundColor: c.card, contentTextStyle: TextStyle(color: c.cardInk), behavior: SnackBarBehavior.floating),
  );
}
