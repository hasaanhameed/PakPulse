import type { Emotion, Language, Platform, Post, Sentiment, Stance } from "../types";
import { topic } from "./topic";

// MOCK DATA for prototyping. These posts are written by hand to exercise the UI
// (English, Urdu and Roman Urdu, sarcasm, low-confidence labels). They are not real
// posts and have no authors or source links.

function snapshotFor(postedAt: string): string {
  const t = new Date(postedAt).getTime();
  const match = topic.snapshots.find(
    (s) => t >= new Date(s.windowStart).getTime() && t < new Date(s.collectedAt).getTime(),
  );
  return match ? match.id : topic.snapshots[topic.snapshots.length - 1].id;
}

function post(
  id: string,
  platform: Platform,
  language: Language,
  narrativeId: string | null,
  postedAt: string,
  text: string,
  stance: [Stance, number],
  sentiment: [Sentiment, number],
  emotion: [Emotion, number],
  sarcasm: [boolean, number],
  engagement: [number, number, number],
  usedContext = false,
): Post {
  const at = `2026-10-${postedAt}:00+05:00`;
  return {
    id,
    platform,
    language,
    text,
    narrativeId,
    postedAt: at,
    snapshotId: snapshotFor(at),
    engagement: { likes: engagement[0], reposts: engagement[1], replies: engagement[2] },
    sourceUrl: null,
    usedContext,
    labels: {
      stance: { value: stance[0], confidence: stance[1] },
      sentiment: { value: sentiment[0], confidence: sentiment[1] },
      emotion: { value: emotion[0], confidence: emotion[1] },
      sarcasm: { value: sarcasm[0], confidence: sarcasm[1] },
    },
  };
}

export const posts: Post[] = [
  // Price rise blamed on IMF conditions
  post("p01", "x", "en", "imf-conditions", "13T21:40",
    "Another fuel price hike because the IMF programme demands it. When do the conditions start applying to the people who negotiated them?",
    ["critical", 0.93], ["negative", 0.9], ["anger", 0.81], [false, 0.77], [1840, 612, 233]),
  post("p02", "x", "ru", "imf-conditions", "15T10:15",
    "IMF ki shartain hain to theek hai, lekin har dafa bojh sirf aam aadmi pe kyun?",
    ["critical", 0.88], ["negative", 0.85], ["disappointment", 0.62], [false, 0.81], [920, 301, 88]),
  post("p03", "threads", "en", "imf-conditions", "17T08:30",
    "To be fair, the levy increase was written into the budget months ago. The surprise is how little was explained to the public.",
    ["neutral", 0.58], ["negative", 0.64], ["disappointment", 0.55], [false, 0.83], [212, 31, 40]),
  post("p04", "x", "ur", "imf-conditions", "14T19:05",
    "آئی ایم ایف کی شرائط پوری کرنے کے لیے پیٹرول مہنگا کیا گیا، مگر اشرافیہ کی مراعات میں کوئی کمی نہیں۔",
    ["critical", 0.91], ["negative", 0.9], ["anger", 0.74], [false, 0.86], [1310, 540, 97]),
  post("p05", "instagram", "ru", "imf-conditions", "17T20:12",
    "Loan lena hai to shartain bhi maanni hongi. Sab ko pata tha yeh hona hai.",
    ["neutral", 0.66], ["neutral", 0.61], ["none", 0.57], [false, 0.79], [388, 0, 52]),

  // Fares and food prices will follow
  post("p06", "x", "en", "fares-and-food", "15T07:50",
    "Rickshaw fares in our area went up by Rs 20 overnight. Vegetable sellers are already quoting new prices. Fuel is never just fuel.",
    ["critical", 0.9], ["negative", 0.88], ["worry", 0.7], [false, 0.84], [2210, 790, 164]),
  post("p07", "x", "ru", "fares-and-food", "17T13:20",
    "Van wale ne kiraya 50 rupay barha diya. Tankhwah wahi, kharche double.",
    ["critical", 0.92], ["negative", 0.9], ["anger", 0.68], [false, 0.8], [1470, 466, 121]),
  post("p08", "x", "ur", "fares-and-food", "16T18:40",
    "کرایوں میں اضافے کے بعد دیہاڑی دار مزدور کے لیے روزانہ شہر آنا مشکل ہو گیا ہے۔",
    ["critical", 0.87], ["negative", 0.89], ["worry", 0.76], [false, 0.88], [860, 274, 45]),
  post("p09", "instagram", "en", "fares-and-food", "15T16:05",
    "Bakery owner told me flour delivery charges are up too. Bread prices next week, he says.",
    ["critical", 0.74], ["negative", 0.71], ["worry", 0.66], [false, 0.85], [540, 0, 63]),
  post("p10", "threads", "ru", "fares-and-food", "18T09:10",
    "Doodh wala keh raha hai agle mahine se rate barhega, transport mehnga ho gaya.",
    ["critical", 0.64], ["negative", 0.69], ["worry", 0.52], [false, 0.82], [143, 12, 19]),

  // Jokes and memes about the new price
  post("p11", "x", "ru", "jokes-and-memes", "14T08:20",
    "Petrol pump pe gaya to attendant ne pucha 'kitne ka dalwana hai?' Maine kaha bas khushboo sungha do.",
    ["critical", 0.61], ["negative", 0.55], ["humour", 0.82], [true, 0.91], [6420, 2310, 388]),
  post("p12", "x", "en", "jokes-and-memes", "14T01:30",
    "Great news everyone, walking is now a premium lifestyle choice.",
    ["critical", 0.57], ["negative", 0.6], ["humour", 0.8], [true, 0.78], [3180, 940, 156]),
  post("p13", "instagram", "ru", "jokes-and-memes", "15T22:45",
    "Shaadi mein salami ke liye ab cash nahi, ek litre petrol diya karein ge.",
    ["critical", 0.55], ["neutral", 0.48], ["humour", 0.86], [true, 0.84], [4100, 0, 302]),
  post("p14", "x", "en", "jokes-and-memes", "16T23:10",
    "Wow, thank you for the price increase. Exactly what my monthly budget was missing.",
    ["critical", 0.82], ["negative", 0.79], ["humour", 0.45], [true, 0.88], [2650, 712, 140]),
  post("p15", "x", "ur", "jokes-and-memes", "14T21:15",
    "اب گاڑی صرف عید پر نکلے گی، باقی دن تصویر دیکھ کر گزارا کریں گے۔",
    ["critical", 0.7], ["negative", 0.62], ["humour", 0.71], [true, 0.74], [1980, 655, 77]),
  post("p16", "threads", "ru", "jokes-and-memes", "17T11:00",
    "Mubarak ho, ab cycle bhi status symbol ban gayi hai.",
    ["critical", 0.52], ["negative", 0.5], ["humour", 0.74], [true, 0.58], [610, 48, 37]),

  // Relief package will offset the increase
  post("p17", "x", "en", "relief-package", "15T12:30",
    "The targeted subsidy for motorcycle owners is a sensible step. Relief should go to those who need it, not to every car owner.",
    ["supportive", 0.86], ["positive", 0.74], ["hope", 0.63], [false, 0.9], [1120, 287, 204]),
  post("p18", "x", "ur", "relief-package", "15T13:05",
    "حکومت کا ریلیف پیکج درست سمت میں قدم ہے، عمل درآمد شفاف ہونا چاہیے۔",
    ["supportive", 0.8], ["positive", 0.7], ["hope", 0.66], [false, 0.87], [760, 198, 61]),
  post("p19", "instagram", "en", "relief-package", "16T09:40",
    "Relief package explained: who qualifies, how to register, and when payments start. Save this post.",
    ["neutral", 0.77], ["neutral", 0.82], ["none", 0.8], [false, 0.93], [2890, 0, 145]),
  post("p20", "x", "ru", "relief-package", "17T15:25",
    "Relief package ka elaan to ho gaya, registration ka portal abhi tak chal nahi raha.",
    ["critical", 0.79], ["negative", 0.76], ["disappointment", 0.7], [false, 0.8], [990, 341, 118]),
  post("p21", "x", "en", "relief-package", "16T14:50",
    "Relief package sounds good. Will believe it when the money actually arrives.",
    ["critical", 0.54], ["neutral", 0.51], ["disappointment", 0.49], [false, 0.55], [470, 96, 58], true),
  post("p22", "threads", "en", "relief-package", "15T19:20",
    "Credit where due: the package is targeted, time-bound and costed. That is better than past blanket subsidies.",
    ["supportive", 0.84], ["positive", 0.78], ["hope", 0.62], [false, 0.89], [330, 41, 52]),

  // Motorcycle commuters hit hardest
  post("p23", "x", "ru", "motorcycle-commuters", "15T08:05",
    "Rozana 40 km bike chalata hoon kaam ke liye. Pehle guzara ho jata tha, ab mahine ka 3,000 extra lagega.",
    ["critical", 0.89], ["negative", 0.87], ["worry", 0.79], [false, 0.86], [1650, 520, 210]),
  post("p24", "x", "en", "motorcycle-commuters", "17T07:35",
    "Motorcycle riders are the backbone of delivery work. A fuel rise hits their daily income directly.",
    ["critical", 0.81], ["negative", 0.75], ["worry", 0.72], [false, 0.9], [880, 233, 49]),
  post("p25", "instagram", "ur", "motorcycle-commuters", "17T19:00",
    "موٹر سائیکل پر روزگار کمانے والوں کے لیے یہ اضافہ ناقابلِ برداشت ہے۔",
    ["critical", 0.9], ["negative", 0.88], ["anger", 0.61], [false, 0.87], [1240, 0, 88]),
  post("p26", "x", "ru", "motorcycle-commuters", "18T08:15",
    "Rider bhaiyon, kya aap logon ne bhi delivery charges barhane ki demand ki hai?",
    ["neutral", 0.53], ["neutral", 0.7], ["none", 0.62], [false, 0.84], [205, 33, 96]),
  post("p27", "threads", "en", "motorcycle-commuters", "17T21:05",
    "Carpooling with two colleagues on one bike now. Safety is a concern but what choice do we have.",
    ["critical", 0.76], ["negative", 0.8], ["worry", 0.74], [false, 0.72], [460, 38, 61]),

  // Transporters threaten a strike
  post("p28", "x", "ru", "transport-strike", "17T10:30",
    "Goods transporters ne Monday se hartal ka elaan kar diya hai agar kiraye ka masla hal na hua.",
    ["neutral", 0.72], ["negative", 0.66], ["worry", 0.6], [false, 0.92], [1380, 802, 130]),
  post("p29", "x", "ur", "transport-strike", "17T12:10",
    "ٹرانسپورٹرز کی ہڑتال ہوئی تو منڈیوں میں سبزی اور پھل کی قلت ہو سکتی ہے۔",
    ["neutral", 0.61], ["negative", 0.74], ["worry", 0.77], [false, 0.9], [970, 388, 57]),
  post("p30", "x", "en", "transport-strike", "18T06:45",
    "Transporters striking will hurt the same people the fuel rise already hurt. Talks need to happen this week.",
    ["critical", 0.58], ["negative", 0.7], ["worry", 0.66], [false, 0.88], [640, 175, 72], true),
  post("p31", "instagram", "ru", "transport-strike", "17T18:20",
    "Hartal se kya hoga? Nuksan to phir bhi dukandaar aur customer ka hai.",
    ["neutral", 0.44], ["negative", 0.63], ["disappointment", 0.51], [false, 0.76], [310, 0, 44]),
  post("p32", "x", "en", "transport-strike", "16T10:05",
    "Transport associations meeting tonight to decide on a strike call over the fuel price.",
    ["neutral", 0.88], ["neutral", 0.8], ["none", 0.84], [false, 0.95], [1020, 610, 39]),

  // Comparisons with regional prices
  post("p33", "x", "en", "regional-comparison", "14T10:10",
    "Even after the increase, petrol here is cheaper than in most of the region. Context matters.",
    ["supportive", 0.7], ["neutral", 0.6], ["none", 0.55], [false, 0.81], [540, 120, 260]),
  post("p34", "x", "ru", "regional-comparison", "15T11:40",
    "Har koi doosre mulkon ka rate compare karta hai, unki tankhwahein compare nahi karta.",
    ["critical", 0.73], ["negative", 0.7], ["disappointment", 0.6], [false, 0.52], [1290, 402, 77]),
  post("p35", "threads", "en", "regional-comparison", "17T16:30",
    "Regional comparisons in dollars ignore purchasing power. In hours worked per litre, we are near the top.",
    ["critical", 0.68], ["negative", 0.6], ["disappointment", 0.63], [false, 0.86], [275, 44, 29]),

  // Not part of any narrative
  post("p36", "x", "en", null, "14T09:00",
    "Long queues at fuel stations last night before the new price kicked in.",
    ["neutral", 0.86], ["neutral", 0.74], ["worry", 0.62], [false, 0.94], [730, 260, 41]),
  post("p37", "x", "ur", null, "13T22:30",
    "نئی قیمتوں کا اطلاق آج رات بارہ بجے سے ہوگا۔",
    ["neutral", 0.95], ["neutral", 0.93], ["none", 0.9], [false, 0.97], [2400, 1190, 85]),
  post("p38", "instagram", "ru", null, "16T08:00",
    "Aaj office walk karke gaya, 25 minute lage. Shayad yahi new normal hai.",
    ["neutral", 0.49], ["neutral", 0.52], ["disappointment", 0.47], [true, 0.41], [820, 0, 66]),
];
