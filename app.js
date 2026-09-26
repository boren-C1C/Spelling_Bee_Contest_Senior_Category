let words=[], remaining=[], current=null;
const $=id=>document.getElementById(id);

// Create a new random order for every contest.
// Fisher-Yates gives every word a fair random position and prevents repeats
// until all words have been drawn.
function shuffle(array){
  const a=[...array];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

function startNewContest(){
  remaining=shuffle(words);
  current=null;
  updateStatus();
}
async function loadWords(){
  try{
    const res=await fetch("words.json");
    if(!res.ok) throw new Error("words.json not found");
    words=await res.json();
    startNewContest();
  }catch(e){
    $("word").textContent="Could not load words.json";
    console.error(e);
  }
}
function updateStatus(){
  $("counter").textContent=`${words.length-remaining.length} / ${words.length} words drawn`;
  $("remaining").textContent=`${remaining.length} remaining`;
}
function drawWord(){
  if(!remaining.length){alert("All words have been drawn. Start a fresh contest.");return}
  // Draw the next word from the already-randomized list.
  current=remaining.pop();
  $("word").textContent=current.word;
  $("pos").textContent=current.partOfSpeech||"";
  $("definition").textContent=current.definition||"";
  $("word").classList.toggle("hidden",$("hideSpelling").checked);
  $("pos").classList.toggle("hidden",$("hideInfo").checked);
  $("definition").classList.toggle("hidden",$("hideInfo").checked);
  updateStatus();
  pronounce();
}
function pronounce(rate=null){
  if(!current) return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(current.word);
  u.lang="en-GB";
  u.rate=rate ?? Number($("speed").value);
  speechSynthesis.speak(u);
}
$("draw").onclick=drawWord;
$("pronounce").onclick=()=>pronounce();
$("slow").onclick=()=>pronounce(0.55);
$("reveal").onclick=()=>{
  if(!current)return;
  $("word").classList.remove("hidden");
};
$("hideSpelling").onchange=()=>{
  if(current)$("word").classList.toggle("hidden",$("hideSpelling").checked);
};
$("hideInfo").onchange=()=>{
  if(current){
    $("pos").classList.toggle("hidden",$("hideInfo").checked);
    $("definition").classList.toggle("hidden",$("hideInfo").checked);
  }
};
$("fresh").onclick=()=>{
  if(confirm("Start a fresh contest? All words will become available again.")){
    startNewContest();
    $("word").textContent="Click “Draw Word”";
    $("word").classList.add("hidden");
    $("pos").classList.add("hidden");
    $("definition").classList.add("hidden");
    updateStatus();
  }
};
$("testVoice").onclick=()=>{
  const u=new SpeechSynthesisUtterance("This is a British English spelling bee voice test.");
  u.lang="en-GB";u.rate=Number($("speed").value);speechSynthesis.cancel();speechSynthesis.speak(u);
};
$("speed").oninput=()=>{$("speedValue").textContent=$("speed").value+"×"};
document.addEventListener("keydown",e=>{
  if(e.target.matches("input"))return;
  const k=e.key.toLowerCase();
  if(k==="d")drawWord();
  if(k==="p")pronounce();
  if(k==="s")pronounce(0.55);
  if(k==="r")$("reveal").click();
});
loadWords();