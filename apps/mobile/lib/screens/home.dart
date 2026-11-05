import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../core/constants.dart';
import '../core/copy.dart';
import '../core/models.dart';
import '../core/rules.dart';
import '../core/session.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';
import '../widgets/birth_chart.dart';
import '../widgets/common.dart';
import '../widgets/credits_bar.dart';
import '../widgets/daily_card.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key, required this.onAsk, required this.onBuy});
  final void Function([String? question]) onAsk;
  final VoidCallback onBuy;
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _ask = TextEditingController();
  late Future<DailyCard> _card = context.api.dailyCard();
  late Future<Chart> _chart = context.api.chart();
  late final Future<Referral> _ref = context.api.referral();
  bool _copied = false;

  @override
  void dispose() { _ask.dispose(); super.dispose(); }

  Future<void> _switchStyle(ChartStyle s) async {
    final session = context.session;
    session.setMe(await session.api.saveProfile(chartStyle: s));
    setState(() => _chart = session.api.chart());
  }

  Future<void> _copyInvite(String url) async {
    await Clipboard.setData(ClipboardData(text: url));
    setState(() => _copied = true);
    await Future<void>.delayed(const Duration(seconds: 2));
    if (mounted) setState(() => _copied = false);
  }

  @override
  Widget build(BuildContext context) {
    final me = context.session.me!;
    final c = context.c;
    final part = dayPartOf(DateTime.now().hour);
    final greet = part == DayPart.night ? 'evening' : part.name;
    final other = me.chartStyle == ChartStyle.north ? ChartStyle.south : ChartStyle.north;

    return SafeArea(
      bottom: false,
      child: RefreshIndicator(
        color: c.accentStrong,
        onRefresh: () async => setState(() { _card = context.api.dailyCard(); _chart = context.api.chart(); }),
        child: ListView(
          padding: const EdgeInsets.fromLTRB(SideraSpace.s4, SideraSpace.s5, SideraSpace.s4, SideraSpace.s8),
          children: [
            Text(t('home.greeting', {'PART': greet, 'NAME': me.name ?? ''}), style: context.text.headlineMedium),
            const SizedBox(height: SideraSpace.s4),
            CreditsBar(credits: me.credits, onBuy: widget.onBuy),
            const SizedBox(height: SideraSpace.s3),
            _AskField(controller: _ask, onSubmit: (q) { _ask.clear(); widget.onAsk(q.trim().isEmpty ? null : q.trim()); }),
            const SizedBox(height: SideraSpace.s5),
            FutureBuilder(
              future: _card,
              builder: (_, s) => s.hasData
                  ? DailyCardView(card: s.data!, onBuy: widget.onBuy, onShare: () => _ref.then((r) => Clipboard.setData(
                      ClipboardData(text: '${s.data!.weekday}: ${s.data!.nakshatra}. ${s.data!.line} ${r.url}'))))
                  : const SizedBox(height: 210),
            ),
            if (!me.questionnaireDone) ...[
              const SizedBox(height: SideraSpace.s4),
              Tile(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(t('home.quizCard'), style: context.text.titleMedium),
                const SizedBox(height: SideraSpace.s3),
                FilledButton(
                  style: FilledButton.styleFrom(minimumSize: const Size(0, 40)),
                  onPressed: () async { final s = context.session; s.setMe(await s.api.saveProfile(questionnaireDone: true)); },
                  child: Text(t('home.quizCta')),
                ),
              ])),
            ],
            const SizedBox(height: SideraSpace.s4),
            Tile(
              padding: const EdgeInsets.all(SideraSpace.s5),
              child: FutureBuilder(
                future: _chart,
                builder: (_, s) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text(t('home.chartH'), style: context.text.titleLarge),
                  TextButton(
                    onPressed: () => _switchStyle(other),
                    style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: const Size(0, 36)),
                    child: Text(t('home.chartSwitch', {'STYLE': t('home.styles.${other.name}')}),
                        style: const TextStyle(decoration: TextDecoration.underline, fontWeight: FontWeight.w500)),
                  ),
                  const SizedBox(height: SideraSpace.s3),
                  if (s.hasData) ...[
                    BirthChart(chart: s.data!),
                    const SizedBox(height: SideraSpace.s5),
                    _Facts(chart: s.data!),
                  ] else
                    const AspectRatio(aspectRatio: 1),
                ]),
              ),
            ),
            const SizedBox(height: SideraSpace.s4),
            FutureBuilder(
              future: _ref,
              builder: (_, s) => Tile(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text(t('home.referH'), style: context.text.titleMedium),
                const SizedBox(height: 4),
                Text(t('home.referLead'), style: context.text.bodyMedium?.copyWith(color: c.inkMuted)),
                const SizedBox(height: SideraSpace.s3),
                OutlinedButton(
                  style: OutlinedButton.styleFrom(minimumSize: const Size(0, 40)),
                  onPressed: s.hasData ? () => _copyInvite(s.data!.url) : null,
                  child: Text(_copied ? t('home.copied') : t('home.referCta')),
                ),
              ])),
            ),
            const SizedBox(height: SideraSpace.s4),
            Tile(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(t('home.waH'), style: context.text.titleMedium),
              const SizedBox(height: 4),
              Text(t('home.waLead'), style: context.text.bodyMedium?.copyWith(color: c.inkMuted)),
              const SizedBox(height: SideraSpace.s3),
              OutlinedButton.icon(
                style: OutlinedButton.styleFrom(minimumSize: const Size(0, 40)),
                onPressed: () => openUrl(whatsappUrl),
                icon: const WhatsAppMark(size: 16),
                label: Text(t('home.waCta')),
              ),
            ])),
          ],
        ),
      ),
    );
  }
}

class _AskField extends StatelessWidget {
  const _AskField({required this.controller, required this.onSubmit});
  final TextEditingController controller;
  final ValueChanged<String> onSubmit;
  @override
  Widget build(BuildContext context) {
    final c = context.c;
    return Container(
      padding: const EdgeInsets.only(left: SideraSpace.s5, right: 6),
      decoration: BoxDecoration(color: c.surface, borderRadius: BorderRadius.circular(SideraRadius.pill), border: Border.all(color: c.line)),
      child: Row(children: [
        Expanded(
          child: TextField(
            controller: controller,
            onSubmitted: onSubmit,
            textInputAction: TextInputAction.send,
            style: const TextStyle(fontSize: 17),
            decoration: InputDecoration(
              hintText: t('home.askPlaceholder'), filled: false, border: InputBorder.none, enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none, contentPadding: const EdgeInsets.symmetric(vertical: 18),
            ),
          ),
        ),
        IconButton.filled(
          onPressed: () => onSubmit(controller.text),
          tooltip: t('chat.send'),
          style: IconButton.styleFrom(backgroundColor: c.accent, foregroundColor: c.onAccent, fixedSize: const Size(44, 44)),
          icon: const Icon(Icons.arrow_forward),
        ),
      ]),
    );
  }
}

class _Facts extends StatelessWidget {
  const _Facts({required this.chart});
  final Chart chart;
  @override
  Widget build(BuildContext context) {
    final signs = Copy.i.list('signs');
    Widget f(String l, String v) => Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Label(l), const SizedBox(height: 2), Text(v, style: context.text.titleMedium),
        ]);
    return Column(children: [
      Row(children: [Expanded(child: f('Lagna', signs[chart.ascSign - 1])), Expanded(child: f('Moon', signs[chart.moonSign - 1]))]),
      const SizedBox(height: SideraSpace.s4),
      Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Expanded(child: f('Nakshatra', chart.nakshatra)),
        Expanded(child: f(t('home.dasha'), chart.dasha)),
      ]),
    ]);
  }
}
