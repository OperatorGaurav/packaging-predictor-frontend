import { useState, useRef, useEffect } from "react";
import ScoreRing from "./ScoreRing";
import { analyzeProduct, getRecommendations, getAllProducts } from "./api";

const card = { background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px", marginBottom: "16px" };
const dimColor = (v) => v >= 75 ? "#63ffb4" : v >= 50 ? "#ffd166" : v >= 30 ? "#ff9f43" : "#ff6b6b";
const priorityColor = (p) => p === "High" ? "#ff6b6b" : p === "Medium" ? "#ffd166" : "#63ffb4";
const Label = ({ text, color = "#63ffb4" }) => <div style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color, fontFamily: "'DM Mono', monospace", marginBottom: "14px" }}>{text}</div>;
const DIM_LABELS = { visualAppeal: "Visual Appeal", brandClarity: "Brand Clarity", shelfImpact: "Shelf Impact", targetAudienceFit: "Audience Fit", trustSignals: "Trust Signals" };
const CATEGORIES = ["Beverage", "Snacks", "PetCare", "PersonalCare", "Electronics", "Household", "Health", "Other"];
const BRAND_TIERS = ["Value", "Mid", "Premium"];

const inp = { width: "100%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "white", fontSize: "14px", padding: "12px 14px", outline: "none", fontFamily: "'DM Sans', sans-serif" };
const sel = { ...inp, cursor: "pointer" };

export default function App() {
  const [tab, setTab] = useState("analyze");
  const [form, setForm] = useState({ name: "", description: "", priceRange: "", targetAudience: "", category: "Beverage", brandTier: "Mid" });
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file?.type.startsWith("image/")) return;
    setImage(URL.createObjectURL(file));
    setImageType(file.type);
    const reader = new FileReader();
    reader.onload = (e) => setImageBase64(e.target.result.split(",")[1]);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!form.name || !form.description) { setError("Product name and description are required."); return; }
    setLoading(true); setError(null); setProduct(null); setRecommendations(null);
    try {
      const result = await analyzeProduct({ ...form, imageBase64, imageType });
      setProduct(result);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleRecommend = async () => {
    if (!product?._id) return;
    setRecLoading(true);
    try { const result = await getRecommendations(product._id); setRecommendations(result); }
    catch (e) { setError(e.message); }
    finally { setRecLoading(false); }
  };

  const loadHistory = async () => {
    setHistoryLoading(true);
    try { setHistory(await getAllProducts()); }
    catch (e) { setError(e.message); }
    finally { setHistoryLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d1a", fontFamily: "'DM Sans', sans-serif", backgroundImage: "radial-gradient(ellipse at 15% 15%, #1a0a3a 0%, transparent 55%), radial-gradient(ellipse at 85% 85%, #0a1a2a 0%, transparent 55%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      <header style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(99,255,180,0.08)", border: "1px solid rgba(99,255,180,0.2)", borderRadius: "20px", padding: "5px 14px", marginBottom: "16px" }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#63ffb4", display: "inline-block" }} />
          <span style={{ fontSize: "10px", fontWeight: "700", letterSpacing: "2px", textTransform: "uppercase", color: "#63ffb4", fontFamily: "'DM Mono', monospace" }}>AI · Dataset-Powered · 2000 Products</span>
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: "800", lineHeight: 1.1, margin: "0 0 10px", background: "linear-gradient(135deg, #fff 30%, #9999dd)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-1px" }}>
          Packaging Success Predictor
        </h1>
        <p style={{ color: "#6666aa", fontSize: "15px", lineHeight: 1.7, margin: "0 0 32px" }}>AI analysis powered by real data from 2,000 packaging products</p>

        <div style={{ display: "flex", gap: "4px", background: "rgba(255,255,255,0.03)", borderRadius: "12px", padding: "4px", marginBottom: "32px", width: "fit-content" }}>
          {[["analyze", "📦 Analyze"], ["recommend", "💡 Improve"], ["history", "📋 History"]].map(([key, label]) => (
            <button key={key} onClick={() => { setTab(key); if (key === "history") loadHistory(); }}
              style={{ padding: "8px 20px", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "13px", fontWeight: "600", fontFamily: "'DM Sans', sans-serif", background: tab === key ? "rgba(99,255,180,0.15)" : "transparent", color: tab === key ? "#63ffb4" : "#6666aa", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>

        {tab === "analyze" && (
          <div>
            <div style={card}>
              <Label text="01 — Product Details" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#7777aa", display: "block", marginBottom: "6px" }}>Product Name *</label>
                  <input style={inp} placeholder="e.g. Organic Green Tea" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#7777aa", display: "block", marginBottom: "6px" }}>Price Range</label>
                  <input style={inp} placeholder="e.g. ₹200-500" value={form.priceRange} onChange={e => setForm({ ...form, priceRange: e.target.value })} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                <div>
                  <label style={{ fontSize: "11px", color: "#7777aa", display: "block", marginBottom: "6px" }}>Category</label>
                  <select style={sel} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "11px", color: "#7777aa", display: "block", marginBottom: "6px" }}>Brand Tier</label>
                  <select style={sel} value={form.brandTier} onChange={e => setForm({ ...form, brandTier: e.target.value })}>
                    {BRAND_TIERS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: "12px" }}>
                <label style={{ fontSize: "11px", color: "#7777aa", display: "block", marginBottom: "6px" }}>Target Audience</label>
                <input style={inp} placeholder="e.g. Health-conscious millennials aged 25-35" value={form.targetAudience} onChange={e => setForm({ ...form, targetAudience: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: "11px", color: "#7777aa", display: "block", marginBottom: "6px" }}>Product Description *</label>
                <textarea style={{ ...inp, resize: "vertical", minHeight: "80px", lineHeight: 1.6 }} placeholder="Describe your product, packaging colors, design elements..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
            </div>

            <div style={card}>
              <Label text="02 — Packaging Image (optional)" />
              {image ? (
                <div>
                  <img src={image} alt="preview" style={{ width: "100%", maxHeight: "220px", objectFit: "contain", borderRadius: "10px", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.08)", background: "#0a0a18" }} />
                  <button onClick={() => { setImage(null); setImageBase64(null); }} style={{ background: "none", border: "1px solid rgba(255,107,107,0.3)", color: "#ff6b6b", padding: "6px 14px", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>✕ Remove</button>
                </div>
              ) : (
                <div onClick={() => fileRef.current.click()} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
                  style={{ border: "2px dashed rgba(99,255,180,0.2)", borderRadius: "12px", padding: "40px", textAlign: "center", cursor: "pointer" }}>
                  <div style={{ fontSize: "32px", marginBottom: "10px" }}>📦</div>
                  <div style={{ color: "#8888bb", fontSize: "14px" }}>Drop image here or <span style={{ color: "#63ffb4" }}>browse</span></div>
                </div>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>

            {error && <div style={{ color: "#ff8888", fontSize: "13px", marginBottom: "14px", padding: "12px 16px", background: "rgba(255,107,107,0.07)", borderRadius: "10px", border: "1px solid rgba(255,107,107,0.2)" }}>{error}</div>}

            <button onClick={handleAnalyze} disabled={loading} style={{ width: "100%", padding: "16px", background: loading ? "rgba(99,255,180,0.08)" : "linear-gradient(135deg, #63ffb4, #00c896)", border: loading ? "1px solid rgba(99,255,180,0.3)" : "none", borderRadius: "12px", color: loading ? "#63ffb4" : "#0a1a0f", fontSize: "14px", fontWeight: "700", cursor: loading ? "not-allowed" : "pointer", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
              {loading ? "⟳  Analysing with Dataset..." : "→  Predict Success"}
            </button>

            {product && (
              <div style={{ marginTop: "32px" }}>
                <Label text="03 — Results" />

                {/* Dataset Insights Banner */}
                {product.analysis?.datasetInsights && (
                  <div style={{ ...card, background: "rgba(99,255,180,0.03)", border: "1px solid rgba(99,255,180,0.15)", marginBottom: "16px" }}>
                    <Label text="📊 Dataset Benchmarks Used" color="#63ffb4" />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                      {[
                        ["Category Success Rate", product.analysis.datasetInsights.categorySuccessRate],
                        ["Avg Engagement", product.analysis.datasetInsights.benchmarkEngagement],
                        ["Avg CTR", product.analysis.datasetInsights.benchmarkCTR],
                      ].map(([label, val]) => (
                        <div key={label} style={{ textAlign: "center", padding: "12px", background: "rgba(99,255,180,0.05)", borderRadius: "10px" }}>
                          <div style={{ fontSize: "18px", fontWeight: "700", color: "#63ffb4", fontFamily: "'DM Mono', monospace" }}>{val}</div>
                          <div style={{ fontSize: "10px", color: "#7777aa", marginTop: "4px" }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    {product.analysis.datasetInsights.topPalettes?.length > 0 && (
                      <div style={{ marginTop: "12px", fontSize: "12px", color: "#7777aa" }}>
                        Top palettes in category: {product.analysis.datasetInsights.topPalettes.map(p => <span key={p} style={{ color: "#63ffb4", marginLeft: "6px", background: "rgba(99,255,180,0.08)", padding: "2px 8px", borderRadius: "10px" }}>{p}</span>)}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ ...card, display: "grid", gridTemplateColumns: "auto 1fr", gap: "28px", alignItems: "center" }}>
                  <ScoreRing score={product.analysis.successScore} verdict={product.analysis.verdict} />
                  <div>
                    <p style={{ color: "#ccccee", fontSize: "14px", lineHeight: 1.75, marginBottom: "16px" }}>{product.analysis.summary}</p>
                    {Object.entries(product.analysis.dimensions).map(([key, val]) => (
                      <div key={key} style={{ marginBottom: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontSize: "11px", color: "#7777aa" }}>{DIM_LABELS[key]}</span>
                          <span style={{ fontSize: "11px", color: dimColor(val), fontFamily: "'DM Mono', monospace" }}>{val}</span>
                        </div>
                        <div style={{ height: "4px", background: "#141428", borderRadius: "2px" }}>
                          <div style={{ height: "100%", width: `${val}%`, background: dimColor(val), borderRadius: "2px", transition: "width 1s ease" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                  <div style={card}>
                    <Label text="✓ Strengths" color="#63ffb4" />
                    {product.analysis.strengths.map((s, i) => <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "13px", color: "#aaaacc" }}><span style={{ color: "#63ffb4", flexShrink: 0 }}>✓</span>{s}</div>)}
                  </div>
                  <div style={card}>
                    <Label text="✗ Weaknesses" color="#ff6b6b" />
                    {product.analysis.weaknesses.map((w, i) => <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "13px", color: "#aaaacc" }}><span style={{ color: "#ff6b6b", flexShrink: 0 }}>✗</span>{w}</div>)}
                  </div>
                </div>

                {/* Similar Products from Dataset */}
                {product.analysis.similarProducts?.length > 0 && (
                  <div style={card}>
                    <Label text="🔍 Similar Successful Products from Dataset" color="#ffd166" />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                      {product.analysis.similarProducts.slice(0, 3).map((p, i) => (
                        <div key={i} style={{ background: "rgba(255,209,102,0.05)", border: "1px solid rgba(255,209,102,0.1)", borderRadius: "10px", padding: "12px" }}>
                          <div style={{ fontSize: "11px", fontWeight: "700", color: "#ffd166", marginBottom: "6px" }}>{p.palette_name} · {p.typography_style}</div>
                          <div style={{ fontSize: "11px", color: "#8888aa" }}>Engagement: <span style={{ color: "#63ffb4" }}>{p.engagement_score}</span></div>
                          <div style={{ fontSize: "11px", color: "#8888aa" }}>CTR: <span style={{ color: "#63ffb4" }}>{p.click_through_rate}</span></div>
                          <div style={{ fontSize: "11px", color: "#8888aa" }}>Emotion: <span style={{ color: "#aaaacc" }}>{p.emotion_label}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button onClick={() => { setTab("recommend"); handleRecommend(); }} style={{ width: "100%", padding: "14px", background: "rgba(255,209,102,0.08)", border: "1px solid rgba(255,209,102,0.3)", borderRadius: "12px", color: "#ffd166", fontSize: "14px", fontWeight: "700", cursor: "pointer", letterSpacing: "1px", fontFamily: "'DM Mono', monospace" }}>
                  💡 GET DATASET-POWERED IMPROVEMENTS →
                </button>
              </div>
            )}
          </div>
        )}

        {tab === "recommend" && (
          <div>
            {!product && (
              <div style={{ ...card, textAlign: "center", padding: "48px" }}>
                <div style={{ fontSize: "40px", marginBottom: "14px" }}>💡</div>
                <p style={{ color: "#6666aa" }}>Analyze a product first to get recommendations.</p>
                <button onClick={() => setTab("analyze")} style={{ marginTop: "16px", background: "rgba(99,255,180,0.1)", border: "1px solid rgba(99,255,180,0.2)", color: "#63ffb4", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", fontSize: "13px" }}>← Go to Analyze</button>
              </div>
            )}

            {product && !recommendations && !recLoading && (
              <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>{product.name}</div>
                  <div style={{ fontSize: "12px", color: "#6666aa" }}>Score: <span style={{ color: dimColor(product.analysis.successScore) }}>{product.analysis.successScore}/100</span> · {product.category} · {product.brandTier}</div>
                </div>
                <button onClick={handleRecommend} style={{ padding: "12px 24px", background: "linear-gradient(135deg, #ffd166, #f9a825)", border: "none", borderRadius: "10px", color: "#1a1000", fontWeight: "700", cursor: "pointer", fontSize: "13px", fontFamily: "'DM Mono', monospace" }}>→ Generate</button>
              </div>
            )}

            {recLoading && <div style={{ textAlign: "center", color: "#ffd166", padding: "40px", fontSize: "14px" }}>⟳ Analyzing dataset for improvements...</div>}

            {recommendations && (
              <div>
                <div style={{ ...card, background: "rgba(255,209,102,0.05)", border: "1px solid rgba(255,209,102,0.2)" }}>
                  <Label text="🎯 Top Priority" color="#ffd166" />
                  <p style={{ fontSize: "15px", color: "#ffeeaa", lineHeight: 1.7 }}>{recommendations.improvements.topPriority}</p>
                </div>

                <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <Label text="Estimated Score After Improvements" color="#63ffb4" />
                    <div style={{ fontSize: "13px", color: "#8888aa" }}>Current: <span style={{ color: dimColor(product?.analysis?.successScore) }}>{product?.analysis?.successScore}</span> → After: <span style={{ color: "#63ffb4", fontSize: "20px", fontWeight: "700" }}>{recommendations.improvements.estimatedScoreAfterImprovements}</span></div>
                  </div>
                  <div style={{ fontSize: "32px", fontWeight: "800", color: "#63ffb4", fontFamily: "'DM Mono', monospace" }}>
                    +{recommendations.improvements.estimatedScoreAfterImprovements - (product?.analysis?.successScore || 0)}
                  </div>
                </div>

                <Label text="Detailed Improvements" />
                {recommendations.improvements.improvements?.map((imp, i) => (
                  <div key={i} style={{ ...card, borderLeft: `3px solid ${priorityColor(imp.priority)}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                      <span style={{ fontSize: "14px", fontWeight: "700" }}>{imp.area}</span>
                      <span style={{ fontSize: "10px", fontWeight: "700", textTransform: "uppercase", color: priorityColor(imp.priority), background: `${priorityColor(imp.priority)}15`, border: `1px solid ${priorityColor(imp.priority)}40`, padding: "3px 10px", borderRadius: "10px" }}>{imp.priority}</span>
                    </div>
                    <div style={{ fontSize: "12px", color: "#6666aa", marginBottom: "5px" }}>❌ <span style={{ color: "#aaaacc" }}>{imp.currentIssue}</span></div>
                    <div style={{ fontSize: "12px", color: "#6666aa", marginBottom: "5px" }}>✅ <span style={{ color: "#ccccee" }}>{imp.suggestion}</span></div>
                    {imp.datasetEvidence && <div style={{ fontSize: "12px", color: "#6666aa", marginBottom: "5px" }}>📊 <span style={{ color: "#ffd166" }}>{imp.datasetEvidence}</span></div>}
                    <div style={{ fontSize: "12px", color: "#63ffb4" }}>📈 {imp.expectedImpact}</div>
                  </div>
                ))}

                {recommendations.improvements.datasetConclusion && (
                  <div style={{ ...card, background: "rgba(99,255,180,0.03)", border: "1px solid rgba(99,255,180,0.1)" }}>
                    <Label text="📊 Dataset Conclusion" color="#63ffb4" />
                    <p style={{ fontSize: "13.5px", color: "#aaaacc", lineHeight: 1.7 }}>{recommendations.improvements.datasetConclusion}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === "history" && (
          <div>
            <Label text="All Analyzed Products" />
            {historyLoading && <div style={{ textAlign: "center", color: "#6666aa", padding: "40px" }}>Loading...</div>}
            {!historyLoading && history.length === 0 && (
              <div style={{ ...card, textAlign: "center", padding: "48px" }}>
                <div style={{ fontSize: "40px", marginBottom: "14px" }}>📋</div>
                <p style={{ color: "#6666aa" }}>No products analyzed yet.</p>
              </div>
            )}
            {history.map((p) => (
              <div key={p._id} style={{ ...card, display: "flex", alignItems: "center", gap: "20px" }}>
                <div style={{ textAlign: "center", minWidth: "60px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "800", color: dimColor(p.analysis?.successScore), fontFamily: "'DM Mono', monospace" }}>{p.analysis?.successScore}</div>
                  <div style={{ fontSize: "9px", color: "#6666aa" }}>/ 100</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "15px", fontWeight: "700", marginBottom: "4px" }}>{p.name}</div>
                  <div style={{ fontSize: "12px", color: "#6666aa", marginBottom: "4px" }}>{p.category} · {p.brandTier} · {p.targetAudience}</div>
                  <div style={{ fontSize: "11px", color: dimColor(p.analysis?.successScore), background: `${dimColor(p.analysis?.successScore)}15`, display: "inline-block", padding: "2px 10px", borderRadius: "10px" }}>{p.analysis?.verdict}</div>
                </div>
                <div style={{ fontSize: "11px", color: "#44446a" }}>{new Date(p.createdAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
