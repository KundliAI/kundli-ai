import 'package:flutter/material.dart';

import '../core/copy.dart';
import '../core/models.dart';
import '../core/session.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';
import '../widgets/birth_chart.dart';
import '../widgets/common.dart';

enum _Notice { error, nudge, blocked }

/// The one long chat, shared with WhatsApp and the website.
class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key, required this.onBuy});
  final VoidCallback onBuy;
  @override
  State<ChatScreen> createState() => ChatScreenState();
}

class ChatScreenState extends State<ChatScreen> {
  final _input = TextEditingController();
  final _scroll = ScrollController();
  List<ChatMessage> _messages = [];
  Chart? _chart;
  bool _busy = false;
  bool _incognito = false;
  _Notice? _notice;
  String? _retry;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final api = context.api;
    final m = await api.messages();
    final c = await api.chart();
    if (!mounted) return;
    setState(() {
      _messages = m;
      _chart = c;
      if (context.session.me!.credits.state == CreditState.empty) _notice = _Notice.blocked;
    });
    _toEnd();
  }

  @override
  void dispose() { _input.dispose(); _scroll.dispose(); super.dispose(); }

  void _toEnd() => WidgetsBinding.instance.addPostFrameCallback((_) {
        if (_scroll.hasClients) _scroll.animateTo(_scroll.position.maxScrollExtent, duration: SideraMotion.base, curve: Curves.easeOut);
      });

  Future<void> send(String raw) async {
    final q = raw.trim();
    final session = context.session;
    if (q.isEmpty || _busy) return;
    if (session.me!.credits.state == CreditState.empty) { setState(() => _notice = _Notice.blocked); return; }
    final mine = ChatMessage(id: 'local-${DateTime.now().microsecondsSinceEpoch}', role: Role.user, text: q, at: DateTime.now());
    _input.clear();
    setState(() { _messages = [..._messages, mine]; _busy = true; _notice = null; });
    _toEnd();
    try {
      final r = await session.api.ask(q, incognito: _incognito);
      session.setCredits(r.credits);
      setState(() {
        _messages = [..._messages, r.message];
        _notice = r.credits.state == CreditState.empty ? _Notice.blocked : (r.nudge ? _Notice.nudge : null);
      });
    } on PaymentRequired {
      setState(() { _messages = _messages.where((m) => m.id != mine.id).toList(); _notice = _Notice.blocked; });
    } on Exception {
      setState(() { _messages = _messages.where((m) => m.id != mine.id).toList(); _notice = _Notice.error; _retry = q; });
    } finally {
      if (mounted) setState(() => _busy = false);
      _toEnd();
    }
  }

  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final me = context.session.me!;
    final lastAstro = _messages.lastWhere((m) => m.role == Role.astrologer, orElse: () => ChatMessage(id: '', role: Role.system, text: '', at: DateTime.now()));
    final blocked = _notice == _Notice.blocked;

    return SafeArea(
      bottom: false,
      child: Column(children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(SideraSpace.s4, SideraSpace.s3, SideraSpace.s4, SideraSpace.s2),
          child: Row(children: [
            Text(t('chat.title'), style: context.text.headlineSmall),
            const Spacer(),
            Pill(
              icon: Icons.visibility_outlined,
              label: t('chat.incognito'),
              selected: _incognito,
              onTap: () => setState(() => _incognito = !_incognito),
            ),
          ]),
        ),
        if (_incognito)
          Container(
            width: double.infinity,
            margin: const EdgeInsets.symmetric(horizontal: SideraSpace.s4),
            padding: const EdgeInsets.all(SideraSpace.s3),
            decoration: BoxDecoration(color: c.surface, borderRadius: BorderRadius.circular(SideraRadius.sm)),
            child: Text(t('chat.incognitoOn'), style: context.text.bodySmall?.copyWith(color: c.ink)),
          ),
        Expanded(
          child: ListView(
            controller: _scroll,
            padding: const EdgeInsets.fromLTRB(SideraSpace.s4, SideraSpace.s3, SideraSpace.s4, SideraSpace.s4),
            children: [
              for (final m in _messages) _Bubble(message: m, chart: m.chart ? _chart : null),
              if (_busy) const Align(alignment: Alignment.centerLeft, child: _Typing()),
              if (!_busy && !blocked && lastAstro.suggestions.isNotEmpty)
                Padding(
                  padding: const EdgeInsets.only(top: SideraSpace.s2),
                  child: Wrap(spacing: SideraSpace.s2, runSpacing: SideraSpace.s2, children: [
                    for (final s in lastAstro.suggestions) Pill(label: s, onTap: () => send(s)),
                  ]),
                ),
            ],
          ),
        ),
        if (_notice != null)
          Container(
            margin: const EdgeInsets.fromLTRB(SideraSpace.s4, 0, SideraSpace.s4, SideraSpace.s2),
            padding: const EdgeInsets.fromLTRB(SideraSpace.s4, 6, 6, 6),
            decoration: BoxDecoration(
              color: c.surface,
              borderRadius: BorderRadius.circular(SideraRadius.md),
              border: _notice == _Notice.error ? Border(left: BorderSide(color: c.danger, width: 3)) : null,
            ),
            child: Row(children: [
              Expanded(child: Text(switch (_notice!) {
                _Notice.error => t('chat.error'),
                _Notice.nudge => t('chat.nudge'),
                _Notice.blocked => me.credits.state == CreditState.trial ? t('chat.trialEnded') : t('chat.blocked'),
              }, style: context.text.bodyMedium?.copyWith(fontWeight: FontWeight.w500))),
              if (_notice == _Notice.error && _retry != null)
                OutlinedButton(style: OutlinedButton.styleFrom(minimumSize: const Size(0, 38)), onPressed: () => send(_retry!), child: Text(t('chat.retry')))
              else
                FilledButton(style: FilledButton.styleFrom(minimumSize: const Size(0, 38)), onPressed: widget.onBuy, child: Text(t('credits.buy'))),
            ]),
          ),
        Container(
          margin: const EdgeInsets.fromLTRB(SideraSpace.s4, 0, SideraSpace.s4, SideraSpace.s3),
          padding: const EdgeInsets.only(left: SideraSpace.s5, right: 6),
          decoration: BoxDecoration(color: c.surface, borderRadius: BorderRadius.circular(28), border: Border.all(color: c.line)),
          child: Row(crossAxisAlignment: CrossAxisAlignment.end, children: [
            Expanded(
              child: TextField(
                controller: _input,
                enabled: !blocked,
                minLines: 1,
                maxLines: 5,
                textInputAction: TextInputAction.send,
                onSubmitted: send,
                onChanged: (_) => setState(() {}),
                decoration: InputDecoration(
                  hintText: t('chat.placeholder'), filled: false, border: InputBorder.none, enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none, disabledBorder: InputBorder.none, contentPadding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: IconButton.filled(
                tooltip: t('chat.send'),
                onPressed: _input.text.trim().isEmpty || _busy || blocked ? null : () => send(_input.text),
                style: IconButton.styleFrom(backgroundColor: c.accent, foregroundColor: c.onAccent, disabledBackgroundColor: c.accent.withValues(alpha: 0.4), fixedSize: const Size(44, 44)),
                icon: const Icon(Icons.arrow_forward),
              ),
            ),
          ]),
        ),
      ]),
    );
  }
}

class _Bubble extends StatelessWidget {
  const _Bubble({required this.message, this.chart});
  final ChatMessage message;
  final Chart? chart;
  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final mine = message.role == Role.user;
    final r = const Radius.circular(20);
    return Padding(
      padding: const EdgeInsets.only(bottom: SideraSpace.s3),
      child: Column(crossAxisAlignment: mine ? CrossAxisAlignment.end : CrossAxisAlignment.start, children: [
        if (chart != null)
          Container(
            width: 300,
            margin: const EdgeInsets.only(bottom: 6),
            padding: const EdgeInsets.all(SideraSpace.s4),
            decoration: BoxDecoration(color: c.bubble, borderRadius: BorderRadius.circular(SideraRadius.lg)),
            child: BirthChart(chart: chart!, lineColor: c.bubbleInk.withValues(alpha: 0.55), inkColor: c.bubbleInk),
          ),
        ConstrainedBox(
          constraints: BoxConstraints(maxWidth: MediaQuery.sizeOf(context).width * 0.82),
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: mine ? c.userBubble : c.bubble,
              borderRadius: BorderRadius.only(topLeft: r, topRight: r,
                  bottomLeft: mine ? r : const Radius.circular(6), bottomRight: mine ? const Radius.circular(6) : r),
            ),
            child: Text(message.text, style: context.text.bodyLarge?.copyWith(color: mine ? c.userBubbleInk : c.bubbleInk)),
          ),
        ),
        if (message.channel == 'whatsapp')
          Padding(padding: const EdgeInsets.only(top: 4), child: Text(t('chat.fromWhatsapp'), style: context.text.bodySmall)),
      ]),
    );
  }
}

class _Typing extends StatefulWidget {
  const _Typing();
  @override
  State<_Typing> createState() => _TypingState();
}

class _TypingState extends State<_Typing> with SingleTickerProviderStateMixin {
  late final _a = AnimationController(vsync: this, duration: const Duration(milliseconds: 1200))..repeat();
  @override
  void dispose() { _a.dispose(); super.dispose(); }
  @override
  Widget build(BuildContext context) {
    final c = context.c;
    return Semantics(
      label: t('chat.thinking'),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: BoxDecoration(color: c.bubble, borderRadius: BorderRadius.circular(20)),
        child: AnimatedBuilder(
          animation: _a,
          builder: (_, _) => Row(mainAxisSize: MainAxisSize.min, children: [
            for (var i = 0; i < 3; i++)
              Container(
                width: 7, height: 7, margin: const EdgeInsets.symmetric(horizontal: 2.5),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: c.bubbleInk.withValues(alpha: 0.3 + 0.6 * (1 - ((_a.value * 3 - i).abs().clamp(0, 1)))),
                ),
              ),
          ]),
        ),
      ),
    );
  }
}
