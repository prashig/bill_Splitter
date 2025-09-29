import React, { useState, useRef } from "react";

export default function BillSplitter() {
  const [people, setPeople] = useState(["You"]);
  const [items, setItems] = useState([]);
  const [taxPct, setTaxPct] = useState(0);
  const [tipPct, setTipPct] = useState(0);
  const [imageParsing, setImageParsing] = useState(false);
  const fileInputRef = useRef(null);

  const fmt = (n) => (isNaN(n) ? "-" : n.toLocaleString(undefined, { style: "currency", currency: "INR" }));

  function addPerson() {
    setPeople((p) => [...p, `Person ${p.length + 1}`]);
  }

  function removePerson(idx) {
    setPeople((p) => p.filter((_, i) => i !== idx));
    setItems((it) =>
      it.map((item) => ({
        ...item,
        sharedBy: item.sharedBy.filter((si) => si !== idx).map((si) => (si > idx ? si - 1 : si)),
        payerIndex: item.payerIndex > idx ? item.payerIndex - 1 : item.payerIndex === idx ? 0 : item.payerIndex,
      }))
    );
  }

  function addItem(defaults = { name: "New item", price: 0, payerIndex: 0, sharedBy: [0] }) {
    setItems((it) => [...it, defaults]);
  }

  function updateItem(i, patch) {
    setItems((it) => it.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function removeItem(i) {
    setItems((it) => it.filter((_, idx) => idx !== i));
  }

  function calculateShares() {
    const subtotal = items.reduce((s, it) => s + Number(it.price || 0), 0);
    const tax = (subtotal * Number(taxPct || 0)) / 100;
    const tip = (subtotal * Number(tipPct || 0)) / 100;
    const total = subtotal + tax + tip;

    const shares = people.map(() => ({ subtotal: 0, tax: 0, tip: 0, total: 0 }));

    items.forEach((it) => {
      const price = Number(it.price || 0);
      const sharers = it.sharedBy && it.sharedBy.length > 0 ? it.sharedBy : [it.payerIndex || 0];
      const perPerson = price / sharers.length;
      sharers.forEach((si) => {
        shares[si].subtotal += perPerson;
      });
      shares[it.payerIndex].subtotal -= price;
    });

    const consumption = people.map((_, idx) => Math.max(0, shares[idx].subtotal));
    const totalConsumption = consumption.reduce((a, b) => a + b, 0) || 1;

    people.forEach((_, idx) => {
      const prop = consumption[idx] / totalConsumption;
      shares[idx].tax = tax * prop;
      shares[idx].tip = tip * prop;
      shares[idx].total = shares[idx].subtotal + shares[idx].tax + shares[idx].tip;
    });

    return { subtotal, tax, tip, total, perPerson: shares.map((s) => ({ ...s, total: Number(s.total.toFixed(2)) })) };
  }

  async function handleParseImage(file) {
    setImageParsing(true);
    try {
      const b64 = await fileToBase64(file);
      const prompt = `Extract line items from this receipt image. Return JSON {items:[{name,price}]}.`;
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_LLAMA_API_KEY || "YOUR_API_KEY"}`,
        },
        body: JSON.stringify({
          model: "llama-3.2-vision",
          input: [
            { role: "user", content: prompt },
            { role: "user", content: { type: "input_image", image_base64: b64 } },
          ],
        }),
      });
      const data = await res.json();
      console.log("API response", data);
      alert("Check console for parsed output. Integrate extraction logic here.");
    } catch (err) {
      console.error(err);
      alert("Error parsing image.");
    } finally {
      setImageParsing(false);
    }
  }

  function fileToBase64(file) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result.split(",")[1]);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });
  }

  const results = calculateShares();

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Bill Splitter</h1>

      <section style={{ marginBottom: "20px" }}>
        <h2>People</h2>
        {people.map((p, idx) => (
          <div key={idx} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input
              value={p}
              onChange={(e) => setPeople((ps) => ps.map((x, i) => (i === idx ? e.target.value : x)))}
            />
            <button onClick={() => removePerson(idx)}>Remove</button>
          </div>
        ))}
        <button style={{ marginTop: "10px" }} onClick={addPerson}>+ Add person</button>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Items</h2>
        {items.map((it, idx) => (
          <div key={idx} style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
            <input value={it.name} onChange={(e) => updateItem(idx, { name: e.target.value })} />
            <input type="number" value={it.price} onChange={(e) => updateItem(idx, { price: Number(e.target.value) })} />
            <select value={it.payerIndex} onChange={(e) => updateItem(idx, { payerIndex: Number(e.target.value) })}>
              {people.map((p, i) => (
                <option key={i} value={i}>{p}</option>
              ))}
            </select>
            <button onClick={() => removeItem(idx)}>Delete</button>
          </div>
        ))}
        <button style={{ marginTop: "10px" }} onClick={() => addItem()}>+ Add item</button>

        <div style={{ marginTop: "10px" }}>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => e.target.files && handleParseImage(e.target.files[0])} />
          {imageParsing && <div>Parsing image...</div>}
        </div>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Tax & Tip</h2>
        <input type="number" value={taxPct} onChange={(e) => setTaxPct(Number(e.target.value))} /> % tax
        <br />
        <input type="number" value={tipPct} onChange={(e) => setTipPct(Number(e.target.value))} /> % tip
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h2>Summary</h2>
        <div>Subtotal: {fmt(results.subtotal)}</div>
        <div>Tax: {fmt(results.tax)}</div>
        <div>Tip: {fmt(results.tip)}</div>
        <div><b>Total: {fmt(results.total)}</b></div>
      </section>

      <section>
        <h2>Per-person breakdown</h2>
        {results.perPerson.map((p, i) => (
          <div key={i} style={{ border: "1px solid #ccc", margin: "8px 0", padding: "8px" }}>
            <div><b>{people[i]}</b></div>
            <div>Consumption: {fmt(p.subtotal)}</div>
            <div>Tax: {fmt(p.tax)}</div>
            <div>Tip: {fmt(p.tip)}</div>
            <div><b>Net: {fmt(p.total)}</b></div>
          </div>
        ))}
      </section>
    </div>
  );
}
