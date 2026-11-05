import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../core/constants.dart';
import '../core/copy.dart';
import '../core/models.dart';
import '../core/rules.dart';
import '../core/session.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';
import '../widgets/common.dart';

enum _Stage { phone, confirm, send, expired, locked }

/// Phone → confirm → send the code on WhatsApp (reverse OTP) → poll until verified.
class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});
  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _ctrl = TextEditingController();
  _Stage _stage = _Stage.phone;
  String? _phone;
  String? _error;
  LoginChallenge? _challenge;
  Timer? _poll;
  bool _busy = false;

  @override
  void dispose() {
    _poll?.cancel();
    _ctrl.dispose();
    super.dispose();
  }

  void _submitPhone() {
    final p = normaliseIndianPhone(_ctrl.text);
    setState(() {
      _error = p == null ? t('login.invalid') : null;
      if (p != null) {
        _phone = p;
        _stage = _Stage.confirm;
      }
    });
  }

  Future<void> _start() async {
    final session = context.session;
    setState(() => _busy = true);
    try {
      final ch = await session.api.startLogin(_phone!);
      setState(() { _challenge = ch; _stage = _Stage.send; });
      _poll?.cancel();
      _poll = Timer.periodic(const Duration(milliseconds: 1500), (timer) async {
        final st = await session.api.loginStatus(ch.challengeId);
        if (st == LoginState.waiting) return;
        timer.cancel();
        if (st == LoginState.verified) {
          await session.refresh();
        } else if (mounted) {
          setState(() => _stage = st == LoginState.expired ? _Stage.expired : _Stage.locked);
        }
      });
    } on Exception {
      setState(() => _stage = _Stage.locked);
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  String get _pretty => _phone == null ? '' : '+91 ${_phone!.substring(3, 8)} ${_phone!.substring(8)}';

  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final body = switch (_stage) {
      _Stage.phone => [
          Text(t('login.h1'), style: context.text.headlineMedium),
          const SizedBox(height: SideraSpace.s3),
          Text(t('login.lead'), style: context.text.bodyLarge?.copyWith(color: c.inkMuted)),
          const SizedBox(height: SideraSpace.s8),
          Text(t('login.phoneLabel'), style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w500)),
          const SizedBox(height: SideraSpace.s2),
          TextField(
            controller: _ctrl,
            autofocus: true,
            keyboardType: TextInputType.phone,
            autofillHints: const [AutofillHints.telephoneNumberNational],
            inputFormatters: [FilteringTextInputFormatter.allow(RegExp(r'[0-9 +\-]'))],
            style: const TextStyle(fontSize: 18),
            onSubmitted: (_) => _submitPhone(),
            decoration: InputDecoration(
              hintText: '98765 43210',
              errorText: _error,
              helperText: _error == null ? t('login.phoneHint') : null,
              prefixIcon: Padding(
                padding: const EdgeInsets.only(left: 18, right: 10),
                child: Text('+91', style: context.text.titleMedium?.copyWith(fontSize: 18)),
              ),
              prefixIconConstraints: const BoxConstraints(minWidth: 0, minHeight: 0),
            ),
          ),
          const SizedBox(height: SideraSpace.s6),
          FilledButton(onPressed: _submitPhone, child: Text(t('login.continue'))),
          const SizedBox(height: SideraSpace.s4),
          Text(t('login.noWhatsapp'), style: context.text.bodySmall),
        ],
      _Stage.confirm => [
          Text(t('login.confirmH'), style: context.text.headlineMedium),
          const SizedBox(height: SideraSpace.s5),
          Text(_pretty, style: context.text.headlineMedium?.copyWith(fontFeatures: const [FontFeature.tabularFigures()])),
          const SizedBox(height: SideraSpace.s8),
          FilledButton(onPressed: _busy ? null : _start, child: Text(t('login.continue'))),
          const SizedBox(height: SideraSpace.s3),
          OutlinedButton(onPressed: () => setState(() => _stage = _Stage.phone), child: Text(t('login.edit'))),
        ],
      _Stage.send => [
          Text(t('login.sendH'), style: context.text.headlineMedium),
          const SizedBox(height: SideraSpace.s3),
          Text(t('login.sendLead'), style: context.text.bodyLarge?.copyWith(color: c.inkMuted)),
          const SizedBox(height: SideraSpace.s6),
          Container(
            padding: const EdgeInsets.symmetric(vertical: 22),
            decoration: BoxDecoration(color: c.card, borderRadius: BorderRadius.circular(SideraRadius.lg)),
            alignment: Alignment.center,
            child: Text(_challenge!.code,
                style: TextStyle(fontFamily: 'monospace', fontSize: 38, letterSpacing: 3, color: c.cardGold, fontWeight: FontWeight.w500)),
          ),
          const SizedBox(height: SideraSpace.s5),
          FilledButton.icon(onPressed: () => openUrl(_challenge!.whatsappUrl), icon: const WhatsAppMark(size: 18), label: Text(t('login.sendCta'))),
          const SizedBox(height: SideraSpace.s5),
          const _Waiting(),
          const SizedBox(height: SideraSpace.s3),
          Center(child: TextButton(onPressed: () => setState(() => _stage = _Stage.confirm), child: Text('${t('login.edit')} $_pretty'))),
        ],
      _Stage.expired || _Stage.locked => [
          Text(_stage == _Stage.expired ? t('login.expired') : t('login.locked'), style: context.text.headlineMedium),
          const SizedBox(height: SideraSpace.s6),
          if (_stage == _Stage.expired) FilledButton(onPressed: _start, child: Text(t('login.newCode'))),
        ],
    };

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(SideraSpace.s6, SideraSpace.s5, SideraSpace.s6, SideraSpace.s8),
          children: [
            const Align(alignment: Alignment.centerLeft, child: Wordmark()),
            SizedBox(height: MediaQuery.sizeOf(context).height * 0.08),
            ...body,
            const SizedBox(height: SideraSpace.s8),
            Center(
              child: TextButton(
                onPressed: () => openUrl('mailto:$supportEmail'),
                child: Text(t('login.lostNumber'), style: const TextStyle(decoration: TextDecoration.underline, fontWeight: FontWeight.w400)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Waiting extends StatefulWidget {
  const _Waiting();
  @override
  State<_Waiting> createState() => _WaitingState();
}

class _WaitingState extends State<_Waiting> with SingleTickerProviderStateMixin {
  late final _a = AnimationController(vsync: this, duration: const Duration(milliseconds: 1400))..repeat(reverse: true);
  @override
  void dispose() { _a.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) => Semantics(
        liveRegion: true,
        child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
          FadeTransition(
            opacity: Tween(begin: 0.35, end: 1.0).animate(_a),
            child: Container(width: 9, height: 9, decoration: BoxDecoration(color: context.c.accent, shape: BoxShape.circle)),
          ),
          const SizedBox(width: 10),
          Text(t('login.waiting'), style: context.text.bodySmall),
        ]),
      );
}
