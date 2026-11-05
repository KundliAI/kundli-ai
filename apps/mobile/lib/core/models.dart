// Mirrors packages/api/openapi.yaml. Keep the two in step.

enum Language { en, hi, hinglish }
enum Interest { marriage, career, relationship, family, personal }
enum DayPart { morning, afternoon, evening, night }
enum ChartStyle { north, south }
enum OnboardingStep { consent, name, birthTime, place, interests, email, done }
enum CreditState { trial, active, low, empty }
enum LoginState { waiting, verified, expired, locked }
enum OrderState { created, pending, paid, failed }
enum Role { user, astrologer, system }

class LoginChallenge {
  const LoginChallenge({required this.challengeId, required this.code, required this.whatsappUrl, required this.triesLeft});
  final String challengeId;
  final String code;
  final String whatsappUrl;
  final int triesLeft;
}

class Place {
  const Place({required this.id, required this.name, required this.region, required this.tz, required this.defaultChartStyle});
  final String id;
  final String name;
  final String region;
  final String tz;
  final ChartStyle defaultChartStyle;
}

class Profile {
  Profile({this.name, this.birthDate, this.birthTime, this.birthDayPart, this.place, this.interests = const [], this.backupEmail, this.consentMemory});
  String? name;
  DateTime? birthDate;
  String? birthTime;
  DayPart? birthDayPart;
  Place? place;
  List<Interest> interests;
  String? backupEmail;
  bool? consentMemory;
}

class Credits {
  const Credits({required this.state, required this.fraction, required this.resetsAt});
  final CreditState state;
  final double fraction;
  final DateTime resetsAt;
}

class Me {
  Me({required this.id, required this.phone, required this.step, required this.profile, required this.credits,
      this.questionnaireDone = false, this.language = Language.en, this.chartStyle = ChartStyle.north});
  final String id;
  final String phone;
  OnboardingStep step;
  bool questionnaireDone;
  Profile profile;
  Credits credits;
  Language language;
  ChartStyle chartStyle;
  String? get name => profile.name;
}

class Planet {
  const Planet({required this.id, required this.sign, required this.house, required this.degree, this.retro = false});
  final String id;
  final int sign;
  final int house;
  final double degree;
  final bool retro;
}

class Chart {
  const Chart({required this.ascSign, required this.moonSign, required this.sunSign, required this.nakshatra,
      required this.planets, required this.style, required this.dasha});
  final int ascSign;
  final int moonSign;
  final int sunSign;
  final String nakshatra;
  final List<Planet> planets;
  final ChartStyle style;
  final String dasha;
}

class DailyCard {
  const DailyCard({required this.weekday, required this.tithi, required this.nakshatra, required this.line,
      required this.locked, this.detail, this.luckyColour, this.goodHours});
  final String weekday;
  final String tithi;
  final String nakshatra;
  final String line;
  final bool locked;
  final String? detail;
  final String? luckyColour;
  final String? goodHours;
}

class ChatMessage {
  const ChatMessage({required this.id, required this.role, required this.text, required this.at,
      this.channel = 'app', this.chart = false, this.suggestions = const []});
  final String id;
  final Role role;
  final String text;
  final DateTime at;
  final String channel;
  final bool chart;
  final List<String> suggestions;
}

class ChatReply {
  const ChatReply(this.message, this.credits, this.nudge);
  final ChatMessage message;
  final Credits credits;
  final bool nudge;
}

class MemoryItem {
  const MemoryItem(this.id, this.text);
  final String id;
  final String text;
}

class CreditPack {
  const CreditPack({required this.id, required this.label, required this.priceInr, required this.questions, this.best = false});
  final String id;
  final String label;
  final int priceInr;
  final int questions;
  final bool best;
}

class Order {
  const Order(this.orderId, this.state, [this.credits]);
  final String orderId;
  final OrderState state;
  final Credits? credits;
}

class Friend {
  const Friend({required this.id, required this.name, required this.sunSign, required this.moonSign, required this.todayLine});
  final String id;
  final String name;
  final String sunSign;
  final String moonSign;
  final String todayLine;
}

class Referral {
  const Referral(this.url, this.joined, this.monthlyCap);
  final String url;
  final int joined;
  final int monthlyCap;
}

class PaymentRequired implements Exception {
  const PaymentRequired();
}
