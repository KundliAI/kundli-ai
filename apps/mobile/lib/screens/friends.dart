import 'package:flutter/material.dart';

import '../core/copy.dart';
import '../core/models.dart';
import '../core/rules.dart';
import '../core/session.dart';
import '../theme/theme.dart';
import '../theme/tokens.g.dart';
import '../widgets/common.dart';

class FriendsScreen extends StatefulWidget {
  const FriendsScreen({super.key});
  @override
  State<FriendsScreen> createState() => _FriendsScreenState();
}

class _FriendsScreenState extends State<FriendsScreen> {
  List<Friend>? _friends;
  Referral? _ref;

  @override
  void initState() {
    super.initState();
    final api = context.api;
    api.friends().then((f) => mounted ? setState(() => _friends = f) : null);
    api.referral().then((r) => mounted ? setState(() => _ref = r) : null);
  }

  Future<void> _add() async {
    final f = await showModalBottomSheet<Friend>(
      context: context,
      isScrollControlled: true,
      backgroundColor: context.c.bg,
      showDragHandle: true,
      builder: (_) => const _AddFriendSheet(),
    );
    if (f != null) setState(() => _friends = [...?_friends, f]);
  }

  @override
  Widget build(BuildContext context) {
    final c = context.c;
    final invite = _ref == null ? null : 'https://wa.me/?text=${Uri.encodeComponent('${t('home.referH')}: ${_ref!.url}')}';
    return SafeArea(
      bottom: false,
      child: ListView(
        padding: const EdgeInsets.fromLTRB(SideraSpace.s4, SideraSpace.s5, SideraSpace.s4, SideraSpace.s8),
        children: [
          Text(t('friends.h1'), style: context.text.headlineMedium),
          const SizedBox(height: SideraSpace.s2),
          Text(t('friends.lead'), style: context.text.bodyLarge?.copyWith(color: c.inkMuted)),
          const SizedBox(height: SideraSpace.s6),
          if (_friends != null && _friends!.isEmpty)
            Padding(padding: const EdgeInsets.only(bottom: SideraSpace.s5), child: Text(t('friends.empty'), style: context.text.bodyMedium?.copyWith(color: c.inkMuted))),
          if (_friends != null && _friends!.isNotEmpty) ...[
            Container(
              decoration: BoxDecoration(color: c.surface, borderRadius: BorderRadius.circular(SideraRadius.lg)),
              child: Column(children: [
                for (final (i, f) in _friends!.indexed) ...[
                  if (i > 0) Divider(height: 1, color: c.line),
                  ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: SideraSpace.s5, vertical: 6),
                    leading: CircleAvatar(backgroundColor: c.card, foregroundColor: c.cardInk, child: Text(f.name.characters.first)),
                    title: Text(f.name, style: context.text.titleMedium),
                    subtitle: Text('${t('friends.sun')} ${f.sunSign} · ${t('friends.moon')} ${f.moonSign}\n${f.todayLine}', style: context.text.bodySmall),
                    isThreeLine: true,
                  ),
                ],
              ]),
            ),
            const SizedBox(height: SideraSpace.s5),
          ],
          FilledButton.icon(onPressed: _add, icon: const Icon(Icons.add), label: Text(t('friends.add'))),
          const SizedBox(height: SideraSpace.s3),
          OutlinedButton.icon(
            onPressed: invite == null ? null : () => openUrl(invite),
            icon: const WhatsAppMark(size: 18),
            label: Text(t('friends.invite')),
          ),
        ],
      ),
    );
  }
}

class _AddFriendSheet extends StatefulWidget {
  const _AddFriendSheet();
  @override
  State<_AddFriendSheet> createState() => _AddFriendSheetState();
}

class _AddFriendSheetState extends State<_AddFriendSheet> {
  final _name = TextEditingController();
  DateTime? _dob;
  String? _err;

  @override
  void dispose() { _name.dispose(); super.dispose(); }

  Future<void> _pick() async {
    final now = DateTime.now();
    final d = await showDatePicker(context: context, initialDate: DateTime(now.year - 25), firstDate: DateTime(1900), lastDate: now);
    if (d == null) return;
    final e = checkBirthDate(d.year, d.month, d.day);
    setState(() { _dob = d; _err = e == null ? null : t(e == DobError.future ? 'onboarding.dobFuture' : 'onboarding.dobInvalid'); });
  }

  @override
  Widget build(BuildContext context) {
    final ok = _name.text.trim().isNotEmpty && _dob != null && _err == null;
    return Padding(
      padding: EdgeInsets.fromLTRB(SideraSpace.s6, 0, SideraSpace.s6, SideraSpace.s6 + MediaQuery.viewInsetsOf(context).bottom),
      child: Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.stretch, children: [
        Text(t('friends.add'), style: context.text.headlineSmall),
        const SizedBox(height: SideraSpace.s5),
        TextField(controller: _name, autofocus: true, textCapitalization: TextCapitalization.words,
            decoration: InputDecoration(labelText: t('friends.name')), onChanged: (_) => setState(() {})),
        const SizedBox(height: SideraSpace.s4),
        InkWell(
          onTap: _pick,
          borderRadius: BorderRadius.circular(SideraRadius.md),
          child: InputDecorator(
            decoration: InputDecoration(labelText: t('onboarding.dobLabel'), errorText: _err, suffixIcon: const Icon(Icons.calendar_today_outlined, size: 20)),
            child: Text(_dob == null ? ' ' : MaterialLocalizations.of(context).formatMediumDate(_dob!)),
          ),
        ),
        const SizedBox(height: SideraSpace.s6),
        FilledButton(
          onPressed: ok ? () async {
            final nav = Navigator.of(context);
            final f = await context.api.addFriend(_name.text.trim(), _dob!);
            nav.pop(f);
          } : null,
          child: Text(t('friends.save')),
        ),
      ]),
    );
  }
}
