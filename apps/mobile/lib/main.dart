import 'package:flutter/material.dart';

import 'api/mock_api.dart';
import 'core/copy.dart';
import 'core/models.dart';
import 'core/session.dart';
import 'screens/login.dart';
import 'screens/onboarding.dart';
import 'screens/shell.dart';
import 'theme/theme.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Copy.load();
  // The mock stands in for the Supabase customer API until it ships.
  final mock = MockApi();
  // Preview links for the web build: ?demo=1 opens signed in, ?demo=onboarding mid-way through onboarding.
  final demo = Uri.base.queryParameters['demo'];
  if (demo != null) mock.seedDemo(step: demo == 'onboarding' ? OnboardingStep.birthTime : OnboardingStep.done);
  final session = Session(mock)..startTab = int.tryParse(Uri.base.queryParameters['tab'] ?? '') ?? 0;
  await session.start();
  runApp(SessionScope(session: session, child: const SideraApp()));
}

class SideraApp extends StatelessWidget {
  const SideraApp({super.key});

  @override
  Widget build(BuildContext context) {
    final s = context.session;
    return MaterialApp(
      title: 'Sidera',
      debugShowCheckedModeBanner: false,
      theme: buildTheme(Brightness.light),
      darkTheme: buildTheme(Brightness.dark),
      themeMode: s.themeMode,
      home: const _Gate(),
    );
  }
}

/// Login → onboarding (resumes at the last saved step) → app.
class _Gate extends StatelessWidget {
  const _Gate();
  @override
  Widget build(BuildContext context) {
    final me = context.session.me;
    final Widget page = me == null
        ? const LoginScreen()
        : me.step != OnboardingStep.done
            ? const OnboardingScreen()
            : const Shell();
    return AnimatedSwitcher(duration: const Duration(milliseconds: 280), child: KeyedSubtree(key: ValueKey(page.runtimeType), child: page));
  }
}
