import 'package:flutter/material.dart';

import '../core/copy.dart';
import '../core/session.dart';
import 'chat.dart';
import 'credits.dart';
import 'friends.dart';
import 'home.dart';
import 'profile.dart';

/// Bottom bar with the same four tabs as the website (D9).
class Shell extends StatefulWidget {
  const Shell({super.key});
  @override
  State<Shell> createState() => _ShellState();
}

class _ShellState extends State<Shell> {
  int _tab = 0;
  final _chatKey = GlobalKey<ChatScreenState>();

  @override
  void initState() {
    super.initState();
    final s = context.session;
    _tab = s.startTab;
    s.startTab = 0;
  }

  void _goChat([String? question]) {
    setState(() => _tab = 1);
    if (question != null) WidgetsBinding.instance.addPostFrameCallback((_) => _chatKey.currentState?.send(question));
  }

  void _openCredits() => Navigator.of(context).push(MaterialPageRoute<void>(builder: (_) => const CreditsScreen()));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(index: _tab, children: [
        HomeScreen(onAsk: _goChat, onBuy: _openCredits),
        ChatScreen(key: _chatKey, onBuy: _openCredits),
        const FriendsScreen(),
        ProfileScreen(onBuy: _openCredits),
      ]),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _tab,
        onDestinationSelected: (i) => setState(() => _tab = i),
        destinations: [
          NavigationDestination(icon: const Icon(Icons.home_outlined), selectedIcon: const Icon(Icons.home_rounded), label: t('nav.home')),
          NavigationDestination(icon: const Icon(Icons.chat_bubble_outline), selectedIcon: const Icon(Icons.chat_bubble), label: t('nav.chat')),
          NavigationDestination(icon: const Icon(Icons.people_outline), selectedIcon: const Icon(Icons.people), label: t('nav.friends')),
          NavigationDestination(icon: const Icon(Icons.person_outline), selectedIcon: const Icon(Icons.person), label: t('nav.profile')),
        ],
      ),
    );
  }
}
