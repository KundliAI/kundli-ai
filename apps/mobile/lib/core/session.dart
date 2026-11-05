import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../api/api.dart';
import 'models.dart';

/// App-wide state: the API, the signed-in account and the appearance choice.
class Session extends ChangeNotifier {
  Session(this.api);
  final SideraApi api;
  Me? me;
  bool loaded = false;
  ThemeMode themeMode = ThemeMode.system;

  /// Tab to open when the shell next appears (onboarding's "Go to chat").
  int startTab = 0;

  static const _themeKey = 'sidera.theme';

  Future<void> start() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      themeMode = switch (prefs.getString(_themeKey)) { 'light' => ThemeMode.light, 'dark' => ThemeMode.dark, _ => ThemeMode.system };
    } on Exception {
      themeMode = ThemeMode.system; // storage unavailable: follow the device
    }
    me = await api.me();
    loaded = true;
    notifyListeners();
  }

  Future<void> refresh() async {
    me = await api.me();
    notifyListeners();
  }

  void setMe(Me m) {
    me = m;
    notifyListeners();
  }

  void setCredits(Credits c) {
    me?.credits = c;
    notifyListeners();
  }

  Future<void> setTheme(ThemeMode m) async {
    themeMode = m;
    notifyListeners();
    final prefs = await SharedPreferences.getInstance();
    if (m == ThemeMode.system) {
      await prefs.remove(_themeKey);
    } else {
      await prefs.setString(_themeKey, m.name);
    }
  }

  Future<void> logout() async {
    await api.logout();
    me = null;
    notifyListeners();
  }
}

class SessionScope extends InheritedNotifier<Session> {
  const SessionScope({super.key, required Session session, required super.child}) : super(notifier: session);
  static Session of(BuildContext context) => context.dependOnInheritedWidgetOfExactType<SessionScope>()!.notifier!;
}

extension SessionContext on BuildContext {
  Session get session => SessionScope.of(this);
  SideraApi get api => SessionScope.of(this).api;
}
