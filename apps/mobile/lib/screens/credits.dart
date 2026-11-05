import 'dart:async';

import 'package:flutter/material.dart';

import '../core/copy.dart';
import '../core/models.dart';
import '../core/session.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';
import '../widgets/common.dart';
import '../widgets/credits_bar.dart';

/// Pay-as-you-go top-up. With the real API this opens Razorpay Checkout; the webhook credits by order ID.
class CreditsScreen extends StatefulWidget {
  const CreditsScreen({super.key});
  @override
  State<CreditsScreen> createState() => _CreditsScreenState();
}

class _CreditsScreenState extends State<CreditsScreen> {
  List<CreditPack>? _packs;
  String? _picked;
  Order? _order;
  Timer? _poll;

  @override
  void initState() {
    super.initState();
    context.api.packs().then((p) {
      if (!mounted) return;
      setState(() { _packs = p; _picked = p.firstWhere((x) => x.best, orElse: () => p.first).id; });
    });
  }

  @override
  void dispose() { _poll?.cancel(); super.dispose(); }

  Future<void> _pay() async {
    final s = context.session;
    final o = await s.api.createOrder(_picked!);
    setState(() => _order = o);
    _poll?.cancel();
    _poll = Timer.periodic(const Duration(milliseconds: 1500), (timer) async {
      final st = await s.api.order(o.orderId);
      if (!mounted) return;
      setState(() => _order = st);
      if (st.state == OrderState.paid || st.state == OrderState.failed) {
        timer.cancel();
        if (st.credits != null) s.setCredits(st.credits!);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final me = context.session.me!;
    final pack = _packs?.where((p) => p.id == _picked).firstOrNull;
    final o = _order;
    return Scaffold(
      appBar: AppBar(backgroundColor: c.bg, surfaceTintColor: Colors.transparent),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(SideraSpace.s4, 0, SideraSpace.s4, SideraSpace.s8),
        children: [
          Text(t('credits.packsH'), style: context.text.headlineMedium),
          const SizedBox(height: SideraSpace.s2),
          Text(t('credits.packsLead'), style: context.text.bodyLarge?.copyWith(color: c.inkMuted)),
          const SizedBox(height: SideraSpace.s5),
          Tile(child: CreditsBar(credits: me.credits, onBuy: () {})),
          const SizedBox(height: SideraSpace.s5),
          if (o != null && o.state != OrderState.created)
            Tile(
              dark: o.state == OrderState.paid,
              padding: const EdgeInsets.all(SideraSpace.s6),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(switch (o.state) {
                  OrderState.paid => t('credits.paid'),
                  OrderState.failed => t('credits.failed'),
                  _ => t('credits.pending'),
                }, style: context.text.titleLarge?.copyWith(fontWeight: FontWeight.w600, color: o.state == OrderState.paid ? c.cardInk : null)),
                if (o.state == OrderState.pending) ...[
                  const SizedBox(height: SideraSpace.s2),
                  Text(t('credits.pendingLead'), style: context.text.bodyMedium?.copyWith(color: c.inkMuted)),
                  const SizedBox(height: SideraSpace.s4),
                  LinearProgressIndicator(color: c.accent, backgroundColor: c.ink.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(4)),
                ],
                if (o.state == OrderState.failed) ...[
                  const SizedBox(height: SideraSpace.s4),
                  FilledButton(onPressed: () { setState(() => _order = null); _pay(); }, child: Text(t('credits.retry'))),
                ],
                if (o.state == OrderState.paid) ...[
                  const SizedBox(height: SideraSpace.s4),
                  FilledButton(onPressed: () => Navigator.of(context).pop(), child: Text(t('home.ask'))),
                ],
              ]),
            )
          else ...[
            for (final p in _packs ?? <CreditPack>[]) _PackCard(pack: p, selected: p.id == _picked, onTap: () => setState(() => _picked = p.id)),
            const SizedBox(height: SideraSpace.s3),
            FilledButton(
              onPressed: pack == null ? null : _pay,
              child: Text(pack == null ? t('credits.buy') : t('credits.pay', {'PRICE': pack.priceInr})),
            ),
          ],
        ],
      ),
    );
  }
}

class _PackCard extends StatelessWidget {
  const _PackCard({required this.pack, required this.selected, required this.onTap});
  final CreditPack pack;
  final bool selected;
  final VoidCallback onTap;
  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final ink = selected ? c.cardInk : c.ink;
    return Padding(
      padding: const EdgeInsets.only(bottom: SideraSpace.s3),
      child: Semantics(
        selected: selected,
        button: true,
        child: AnimatedContainer(
          duration: SideraMotion.fast,
          decoration: BoxDecoration(
            color: selected ? c.card : c.surface,
            borderRadius: BorderRadius.circular(SideraRadius.lg),
            border: Border.all(color: selected ? c.accent : Colors.transparent, width: 2),
          ),
          child: InkWell(
            onTap: onTap,
            borderRadius: BorderRadius.circular(SideraRadius.lg),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(SideraSpace.s5, SideraSpace.s4, SideraSpace.s5, SideraSpace.s4),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Row(children: [
                  Text(pack.label, style: context.text.titleMedium?.copyWith(color: ink)),
                  const Spacer(),
                  if (pack.best) Label(t('credits.best'), color: selected ? c.cardGold : c.accentStrong),
                ]),
                const SizedBox(height: 2),
                Text('₹${pack.priceInr}', style: context.text.headlineMedium?.copyWith(color: ink, fontFeatures: const [FontFeature.tabularFigures()])),
                Text(t('credits.questions', {'N': pack.questions}), style: context.text.bodyMedium?.copyWith(color: selected ? c.cardMuted : c.inkMuted)),
              ]),
            ),
          ),
        ),
      ),
    );
  }
}
