// In-memory stand-in for the customer API until the Supabase `customer-api`
// function ships. Same behaviour as apps/web/src/lib/api/mock.ts.
import 'dart:math';

import '../core/models.dart';
import '../core/rules.dart';
import 'api.dart';

class MockApi implements SideraApi {
  final _rnd = Random();
  Me? _me;
  bool _signedIn = false;
  String? _challenge;
  DateTime? _challengeAt;
  final List<ChatMessage> _messages = [];
  final List<MemoryItem> _memory = [];
  final List<Friend> _friends = [];
  final Map<String, (OrderState, DateTime)> _orders = {};

  Future<void> _wait([int ms = 350]) => Future.delayed(Duration(milliseconds: ms));
  String _id() => _rnd.nextInt(1 << 31).toRadixString(36);

  static DateTime _midnight() {
    final n = DateTime.now();
    return DateTime(n.year, n.month, n.day + 1);
  }

  static Credits _credits(double f, {bool trial = false}) {
    final band = creditBand(f);
    final state = trial && band != CreditBand.empty
        ? CreditState.trial
        : switch (band) { CreditBand.ok => CreditState.active, CreditBand.low => CreditState.low, CreditBand.empty => CreditState.empty };
    return Credits(state: state, fraction: f, resetsAt: _midnight());
  }

  static const _places = [
    ('Jaipur', 'Rajasthan, India'), ('Delhi', 'Delhi, India'), ('Mumbai', 'Maharashtra, India'),
    ('Lucknow', 'Uttar Pradesh, India'), ('Varanasi', 'Uttar Pradesh, India'), ('Kolkata', 'West Bengal, India'),
    ('Chennai', 'Tamil Nadu, India'), ('Madurai', 'Tamil Nadu, India'), ('Bengaluru', 'Karnataka, India'),
    ('Hyderabad', 'Telangana, India'), ('Kochi', 'Kerala, India'), ('Vijayawada', 'Andhra Pradesh, India'),
    ('Pune', 'Maharashtra, India'), ('Ahmedabad', 'Gujarat, India'), ('Patna', 'Bihar, India'),
    ('Bhopal', 'Madhya Pradesh, India'), ('Indore', 'Madhya Pradesh, India'), ('Chandigarh', 'Chandigarh, India'),
  ];

  /// Preview helper: a signed-in account part-way through (or done with) onboarding.
  void seedDemo({OnboardingStep step = OnboardingStep.done}) {
    _me = Me(
      id: 'demo', phone: '+919876543210', step: step, credits: _credits(0.62, trial: true),
      profile: Profile(name: 'Aarav', birthDate: DateTime(1996, 8, 14), birthDayPart: DayPart.afternoon,
          place: Place(id: 'jaipur', name: 'Jaipur', region: 'Rajasthan, India', tz: 'Asia/Kolkata', defaultChartStyle: defaultChartStyle('Rajasthan, India'))),
    );
    _signedIn = true;
    _messages.add(ChatMessage(
      id: _id(), role: Role.astrologer, at: DateTime.now(), chart: true,
      text: 'Namaste Aarav. Here is your kundli. You are Leo rising with the Moon in Rohini nakshatra, '
          'and you are in the Venus–Saturn period. What would you like to know first?',
      suggestions: const ['Career', 'Marriage', 'Health'],
    ));
  }

  @override
  Future<LoginChallenge> startLogin(String phone, {String? ref}) async {
    await _wait();
    _challenge = _id();
    _challengeAt = DateTime.now();
    if (_me?.phone != phone) {
      _me = Me(id: _id(), phone: phone, step: OnboardingStep.consent, profile: Profile(), credits: _credits(1, trial: true));
      _messages.clear();
    }
    final code = 'SID-${1000 + _rnd.nextInt(9000)}';
    return LoginChallenge(
      challengeId: _challenge!, code: code, triesLeft: 5,
      whatsappUrl: 'https://wa.me/916377943974?text=${Uri.encodeComponent(code)}',
    );
  }

  @override
  Future<LoginState> loginStatus(String challengeId) async {
    await _wait(200);
    if (challengeId != _challenge) return LoginState.expired;
    if (DateTime.now().difference(_challengeAt!).inMilliseconds > 4000) {
      _signedIn = true;
      return LoginState.verified;
    }
    return LoginState.waiting;
  }

  @override
  Future<void> logout() async => _signedIn = false;

  @override
  Future<Me?> me() async {
    await _wait(100);
    return _signedIn ? _me : null;
  }

  @override
  Future<Me> saveProfile({
    OnboardingStep? step, String? name, DateTime? birthDate, String? birthTime, DayPart? birthDayPart,
    Place? place, List<Interest>? interests, String? backupEmail, bool? consentMemory,
    Language? language, ChartStyle? chartStyle, bool? questionnaireDone,
  }) async {
    await _wait(200);
    final me = _me!;
    final p = me.profile;
    if (name != null) p.name = name;
    if (birthDate != null) p.birthDate = birthDate;
    if (birthTime != null) { p.birthTime = birthTime; p.birthDayPart = null; }
    if (birthDayPart != null) { p.birthDayPart = birthDayPart; p.birthTime = null; }
    if (place != null) { p.place = place; me.chartStyle = place.defaultChartStyle; }
    if (interests != null) p.interests = interests;
    if (backupEmail != null) p.backupEmail = backupEmail;
    if (consentMemory != null) p.consentMemory = consentMemory;
    if (language != null) me.language = language;
    if (chartStyle != null) me.chartStyle = chartStyle;
    if (questionnaireDone != null) me.questionnaireDone = questionnaireDone;
    if (step != null) me.step = step;
    if (step == OnboardingStep.done && _messages.isEmpty) {
      _messages.add(ChatMessage(
        id: _id(), role: Role.astrologer, at: DateTime.now(), chart: true,
        text: 'Namaste ${me.name ?? ''}. Here is your kundli. You are Leo rising with the Moon in Rohini nakshatra, '
            'and you are in the Venus–Saturn period. What would you like to know first?',
        suggestions: const ['Career', 'Marriage', 'Health'],
      ));
    }
    return me;
  }

  @override
  Future<List<Place>> places(String q) async {
    await _wait(150);
    final s = q.trim().toLowerCase();
    if (s.isEmpty) return [];
    return _places
        .where((p) => p.$1.toLowerCase().startsWith(s) || p.$2.toLowerCase().contains(s))
        .take(6)
        .map((p) => Place(id: p.$1.toLowerCase(), name: p.$1, region: p.$2, tz: 'Asia/Kolkata', defaultChartStyle: defaultChartStyle(p.$2)))
        .toList();
  }

  @override
  Future<Chart> chart() async {
    await _wait(150);
    const asc = 5;
    const raw = [('Su', 9, 12.4, false), ('Mo', 2, 3.1, false), ('Ma', 11, 21.7, false), ('Me', 9, 27.9, false),
      ('Ju', 6, 8.3, true), ('Ve', 10, 2.2, false), ('Sa', 12, 15.6, false), ('Ra', 1, 9.8, true), ('Ke', 7, 9.8, true)];
    return Chart(
      ascSign: asc, moonSign: 2, sunSign: 9, nakshatra: 'Rohini', dasha: 'Venus – Saturn until Mar 2027',
      style: _me?.chartStyle ?? ChartStyle.north,
      planets: [for (final p in raw) Planet(id: p.$1, sign: p.$2, degree: p.$3, retro: p.$4, house: ((p.$2 - asc + 12) % 12) + 1)],
    );
  }

  @override
  Future<DailyCard> dailyCard() async {
    await _wait(150);
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    final locked = (_me?.credits.fraction ?? 0) <= 0;
    return DailyCard(
      weekday: days[DateTime.now().weekday - 1], tithi: 'Shukla Panchami', nakshatra: 'Rohini',
      line: 'A steady day for money talks. Wait on big purchases till evening.', locked: locked,
      detail: locked ? null : 'The Moon in Rohini favours slow, patient work: paperwork, savings, family plans. '
          'Mars squares your 4th house, so keep home conversations short and kind. Good for starting a habit, not for ending one.',
      luckyColour: locked ? null : 'Saffron', goodHours: locked ? null : '10:40 am – 12:15 pm',
    );
  }

  @override
  Future<List<ChatMessage>> messages() async {
    await _wait(150);
    return List.of(_messages);
  }

  String _answer(String q, String name) {
    final t = q.toLowerCase();
    if (RegExp(r'shaadi|marri|vivah|शादी').hasMatch(t)) {
      return '$name, your 7th house is Aquarius and its lord Saturn sits in the 5th, in Pisces. That points to a marriage that grows '
          "out of friendship or shared work. Your Venus–Saturn period runs to March 2027; the stronger window opens with Jupiter's "
          'move into your 7th from late 2027 into 2028.';
    }
    if (RegExp(r'job|career|naukri|kaam|promotion|business').hasMatch(t)) {
      return 'Your 10th house is Taurus with Venus as its lord, placed in the 3rd. Work that uses your voice and your hands suits you: '
          "writing, design, sales, teaching. Saturn's transit through your 8th makes 2026 a year for building skills rather than "
          'switching jobs. Changes look better after May 2027.';
    }
    if (RegExp(r'health|sehat|tabiyat').hasMatch(t)) {
      return 'Your 6th house lord Saturn is steady, and the Moon in Taurus gives good stamina. Watch sleep and digestion during the '
          'Saturn transit; routine helps more than remedies here. This is guidance, not medical advice.';
    }
    return 'Here is what your chart says. Your Moon is in Rohini, which gives a steady, caring mind that likes things settled before '
        'it moves. Right now you are in Venus–Saturn: slow, patient progress that pays off later. Ask me about a specific area, '
        "like marriage, career or money, and I'll go deeper.";
  }

  @override
  Future<ChatReply> ask(String text, {bool incognito = false}) async {
    final me = _me!;
    if (me.credits.fraction <= 0) throw const PaymentRequired();
    if (!incognito) _messages.add(ChatMessage(id: _id(), role: Role.user, text: text, at: DateTime.now()));
    await _wait(1400);
    final next = max(0.0, double.parse((me.credits.fraction - 0.12).toStringAsFixed(2)));
    me.credits = _credits(next, trial: me.credits.state == CreditState.trial);
    final a = ChatMessage(id: _id(), role: Role.astrologer, text: _answer(text, me.name ?? 'Friend'), at: DateTime.now(),
        suggestions: const ['What should I do now?', 'Any remedies?']);
    if (!incognito) _messages.add(a);
    return ChatReply(a, me.credits, creditBand(next) == CreditBand.low);
  }

  @override
  Future<void> clearChat() async { await _wait(); _messages.clear(); }

  @override
  Future<List<MemoryItem>> memory() async {
    await _wait(150);
    if (_memory.isEmpty && _me?.step == OnboardingStep.done) {
      _memory.addAll([MemoryItem(_id(), 'Works in design, thinking about a job change'), MemoryItem(_id(), 'Prefers answers in Hinglish')]);
    }
    return List.of(_memory);
  }

  @override
  Future<void> forget(String id) async { await _wait(150); _memory.removeWhere((m) => m.id == id); }

  @override
  Future<List<CreditPack>> packs() async {
    await _wait(150);
    return const [
      CreditPack(id: 'p49', label: 'Quick question', priceInr: 49, questions: 5),
      CreditPack(id: 'p149', label: 'Deeper look', priceInr: 149, questions: 20, best: true),
      CreditPack(id: 'p399', label: 'Whole year', priceInr: 399, questions: 60),
    ];
  }

  @override
  Future<Order> createOrder(String packId) async {
    await _wait(300);
    final id = 'order_${_id()}';
    _orders[id] = (OrderState.pending, DateTime.now());
    return Order(id, OrderState.pending);
  }

  @override
  Future<Order> order(String orderId) async {
    await _wait(300);
    final o = _orders[orderId];
    if (o == null) return Order(orderId, OrderState.failed);
    if (o.$1 == OrderState.pending && DateTime.now().difference(o.$2).inMilliseconds > 2500) {
      _orders[orderId] = (OrderState.paid, o.$2);
      _me?.credits = _credits(1);
      return Order(orderId, OrderState.paid, _me?.credits);
    }
    return Order(orderId, o.$1, _me?.credits);
  }

  @override
  Future<List<Friend>> friends() async { await _wait(150); return List.of(_friends); }

  @override
  Future<Friend> addFriend(String name, DateTime birthDate) async {
    await _wait(300);
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    final f = Friend(id: _id(), name: name, sunSign: signs[name.length % 12], moonSign: signs[(name.length * 5) % 12],
        todayLine: 'Good day to reach out. Small plans go well.');
    _friends.add(f);
    return f;
  }

  @override
  Future<Referral> referral() async { await _wait(150); return const Referral('https://sidera.app/i/aarav7', 1, 5); }

  @override
  Future<void> deleteAccount() async { await _wait(); _me = null; _signedIn = false; _messages.clear(); }
}
