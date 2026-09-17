const DAY_MS=86400000;
const pad=n=>String(n).padStart(2,'0');
const dayKey=date=>`${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
const localDay=date=>new Date(date.getFullYear(),date.getMonth(),date.getDate());

export function streakDays(sessions=[],now=new Date()){
 const days=new Set();
 for(const session of sessions){
  const date=new Date(session?.date);
  if(!Number.isNaN(date.getTime()))days.add(dayKey(date));
 }
 let cursor=localDay(now);
 if(!days.has(dayKey(cursor))){
  cursor.setDate(cursor.getDate()-1);
  if(!days.has(dayKey(cursor)))return 0;
 }
 let streak=0;
 while(days.has(dayKey(cursor))){streak++;cursor.setDate(cursor.getDate()-1);}
 return streak;
}

const GUIDES=Object.freeze({
 '品詞':{feature:'空欄の前後から、まず必要な品詞を決めるタイプの問題。',reason:'名詞・形容詞・副詞・動詞は文中で置ける位置と修飾できる相手が違うため、意味より先に文の骨格を見ると候補を絞れる。',pitfall:'同じ語幹の派生語は意味が似ているので、日本語の意味だけで選ぶと誤りやすい。空欄の直前・直後が何を要求しているかを確認する。'},
 '語彙':{feature:'単語単体の意味より、前後の語との自然な組み合わせを見抜く語彙問題。',reason:'TOEICでは意味が近い語でも、目的語・前置詞・ビジネス場面との相性が異なる。文全体で自然なコロケーションになる語だけが残る。',pitfall:'日本語訳が近い選択肢に引っ張られやすい。正解語を「どの語とセットで使うか」まで一緒に覚えると再発しにくい。'},
 '前置詞':{feature:'名詞句の前に置く語と、その後ろの名詞との意味関係を問う問題。',reason:'前置詞は後ろに名詞・代名詞・動名詞を取り、時間・場所・理由・手段などの関係を示す。前後の意味関係が一致するものを選ぶ。',pitfall:'接続詞と形が似た語を選んだり、日本語では同じ「〜で／〜に」になる前置詞を混同しやすい。後ろが節か名詞句かも確認する。'},
 '接続詞':{feature:'空欄の前後にある節同士を、意味と文法の両方でつなぐ問題。',reason:'接続詞の後ろには主語＋動詞を含む節が続く。原因・逆接・条件・時など、前後の論理関係と形の両方が合う必要がある。',pitfall:'前置詞と意味が似ていても、後ろが名詞句か節かで使える語が変わる。意味だけでなく直後の構造を見る。'},
 '動詞':{feature:'主語・目的語・補語との関係から、動詞の形や語法を決める問題。',reason:'動詞ごとに取れる目的語や補語、能動・受動の相性が決まっている。主語が動作主か受け手か、後ろに何が続くかを確認する。',pitfall:'意味が近い動詞でも他動詞・自動詞や語法が違う。日本語訳だけではなく、後ろに前置詞が必要かまで見る。'},
 '時制':{feature:'文中の時間表現や出来事の前後関係から、適切な時制を選ぶ問題。',reason:'英語の時制は「いつ起きたか」だけでなく、別の出来事より前か、今まで継続しているかも表す。時間の基準点を先に決める。',pitfall:'yesterday など一語だけを見るのではなく、when節・by the time・since・for など文全体の時間関係を見る。'},
 '分詞':{feature:'現在分詞と過去分詞のどちらが、修飾される名詞との意味関係に合うかを見る問題。',reason:'現在分詞は能動・進行の意味、過去分詞は受動・完了の意味になりやすい。修飾される名詞が動作をする側か、される側かで判断する。',pitfall:'語尾だけで -ing / -ed を選ぶと危険。名詞と動詞の関係を日本語にして「〜する／〜される」で確かめる。'},
 '動名詞':{feature:'動詞の後ろに動名詞を取るか、不定詞など別の形を取るかを問う語法問題。',reason:'英語では動詞ごとに後ろに取れる形が決まっている。意味だけではなく、動詞＋動名詞というまとまりで覚える必要がある。',pitfall:'to不定詞と意味が似るため混同しやすい。avoid, consider, postpone など代表的な動名詞目的語の動詞はセットで確認する。'},
 '関係詞':{feature:'先行詞と後ろの節をつなぎ、節の中で何の役割が欠けているかを見る問題。',reason:'who/which/that は節内で主語・目的語になり、whose は所有、where/when は副詞の役割をする。後ろの節が完全か不完全かが大きな手掛かり。',pitfall:'先行詞が人か物かだけで決めると外しやすい。後ろの節に主語や目的語が欠けているかまで確認する。'},
 '比較':{feature:'比較級・最上級・同等比較などの定型と、比較対象の対応を問う問題。',reason:'than, as ... as, the most などの目印に加え、何と何を比較しているかが文法的にそろっている必要がある。',pitfall:'more と -er の二重比較、than の後ろの形の不一致、much/far など比較級を強める語の見落としに注意する。'},
 '仮定法':{feature:'現実とは異なる仮定や過去への反実仮想を、時制をずらして表す問題。',reason:'仮定法では事実との距離を時制の後退で表す。過去の反実なら had + 過去分詞 と would have + 過去分詞の対応が基本。',pitfall:'if節と主節の時制を別々に見ると崩れやすい。現在の仮定か、過去の仮定かを先に決めてセットで選ぶ。'},
 '倒置':{feature:'否定・制限表現などが文頭に出たため、通常語順ではなく倒置になる問題。',reason:'Never, Rarely, Only after, Not until などが文頭に来ると、疑問文のように助動詞＋主語＋動詞の語順になる。',pitfall:'意味は読めても通常語順のまま選びやすい。文頭の否定・制限表現を見たら、まず倒置を疑う。'},
 '不定詞':{feature:'to + 動詞原形が名詞・形容詞・副詞のどの役割で使われているかを見る問題。',reason:'不定詞は動詞ごとの語法や、目的・予定・結果などの意味を作る。直前の動詞や名詞が不定詞を要求しているかを確認する。',pitfall:'動名詞と交換できそうに見えても、動詞ごとに取れる形が決まっている場合が多い。直前の語とのセットで覚える。'},
 '数量表現':{feature:'可算・不可算、単数・複数に合わせて数量表現を選ぶ問題。',reason:'many/few は可算名詞、much/little は不可算名詞など、後ろの名詞の性質で使える表現が決まる。',pitfall:'意味が近くても名詞の種類が合わないと誤り。後ろの名詞が数えられるか、単数か複数かを先に確認する。'}
});

const DEFAULT_GUIDE={feature:'空欄の前後と文全体の意味を組み合わせて判断するPart 5問題。',reason:'正解は意味だけでなく、文法・語法・語のつながりがすべて成立する必要がある。',pitfall:'選択肢単体の意味だけで決めず、空欄の直前・直後と文全体をもう一度確認する。'};

function specialGuide(sentence){
 if(/^No sooner\b/i.test(sentence))return{feature:'「No sooner ... than ...」の定型表現と倒置を同時に問う問題。',reason:'No sooner が文頭に出ると had + 主語 + 過去分詞の倒置になり、後半は than で受ける。二つの出来事がほぼ連続して起きたことを表す。',pitfall:'than を when/then と混同したり、通常語順で読んでしまいやすい。No sooner と than をセットで覚える。'};
 if(/^(Not until|Only after|Rarely|Under no circumstances)\b/i.test(sentence))return{feature:'否定・制限表現を文頭に出したことで倒置が起こる文。',reason:'文頭の否定・制限表現が強調されると、主節は助動詞＋主語＋動詞の語順になる。意味だけでなく語順そのものが正解条件になる。',pitfall:'通常語順でも意味が通じそうに見えるのが落とし穴。文頭表現を見た瞬間に倒置の有無を確認する。'};
 if(/^Had\b/i.test(sentence))return{feature:'if を省略した仮定法過去完了の倒置表現。',reason:'Had + 主語 + 過去分詞は If + 主語 + had + 過去分詞と同じ働きをする。主節では would/could have + 過去分詞が対応することが多い。',pitfall:'通常の過去完了と見誤りやすい。文頭の Had の直後に主語が来たら、if省略の仮定法を疑う。'};
 if(/^Should\b/i.test(sentence))return{feature:'if を省略した条件節の倒置表現。',reason:'Should + 主語 + 動詞原形は If + 主語 + should + 動詞原形に相当し、ややフォーマルな条件を表す。',pitfall:'疑問文と誤認しやすい。文末が疑問符でなく主節が続く場合は、条件節の倒置を確認する。'};
 return null;
}

export function guidanceFor({category='',sentence='',answer=''}={}){
 const guide=specialGuide(sentence)||GUIDES[category]||DEFAULT_GUIDE;
 return{
  feature:`${guide.feature}${answer?` 正解語は「${answer}」。`:''}`,
  reason:guide.reason,
  pitfall:guide.pitfall
 };
}
