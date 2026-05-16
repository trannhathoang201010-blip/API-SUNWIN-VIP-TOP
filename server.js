const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

const API_GOC = 'https://api-bot-telegram-o1h3.onrender.com/sunwin/tx';

// ==========================================
// 54 THUẬT TOÁN PHÂN TÍCH TÀI XỈU
// ==========================================

class SieuThuậtToanTaiXiu {
    constructor() {
        this.apiHistory = [];
        this.bridgeData = [];
        this.ketQuaThucTe = [];
        this.tongDiemData = [];
        this.diceData = [];
        this.learningStats = { dung: 0, sai: 0, tiLe: 0 };
        this.trongSoThuậtToan = {};
        
        for (let i = 1; i <= 54; i++) {
            this.trongSoThuậtToan[`tt${i}`] = 1.0;
        }
    }

    // ==========================================
    // NHÓM 1: THUẬT TOÁN CẦU CƠ BẢN (1-10)
    // ==========================================
    
    tt1_cauBet(lichSu) {
        if (lichSu.length < 3) return null;
        let streak = 1;
        for (let i = 1; i < lichSu.length; i++) {
            if (lichSu[i] === lichSu[i-1]) streak++;
            else break;
        }
        if (streak >= 4) return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 75 + (streak-4)*3, lyDo: `Bệt ${streak} phiên → bẻ cầu` };
        if (streak === 3) return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 68, lyDo: `Bệt 3 phiên → chuẩn bị gãy` };
        return null;
    }
    
    tt2_cau1_1(lichSu) {
        if (lichSu.length < 4) return null;
        let zigzag = 0;
        for (let i = 1; i < 4; i++) if (lichSu[i] !== lichSu[i-1]) zigzag++;
        if (zigzag >= 3) return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 72, lyDo: "Cầu 1-1 (zigzag) → đánh ngược" };
        return null;
    }
    
    tt3_cau2_1(lichSu) {
        if (lichSu.length < 6) return null;
        if (lichSu[0] === lichSu[1] && lichSu[3] === lichSu[4] && lichSu[0] !== lichSu[3]) {
            return { pred: lichSu[0], doTinCay: 74, lyDo: "Cầu 2-1 → theo nhịp" };
        }
        return null;
    }
    
    tt4_cau1_2(lichSu) {
        if (lichSu.length < 6) return null;
        if (lichSu[0] !== lichSu[1] && lichSu[1] === lichSu[2] && lichSu[3] !== lichSu[4]) {
            return { pred: lichSu[3], doTinCay: 70, lyDo: "Cầu 1-2 → theo nhịp" };
        }
        return null;
    }
    
    tt5_cau2_2(lichSu) {
        if (lichSu.length < 8) return null;
        if (lichSu[0] === lichSu[1] && lichSu[2] === lichSu[3] && lichSu[4] === lichSu[5] && lichSu[6] === lichSu[7]) {
            if (lichSu[0] !== lichSu[2] && lichSu[2] !== lichSu[4]) {
                return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 76, lyDo: "Cầu 2-2-2-2 → luân phiên" };
            }
        }
        return null;
    }
    
    tt6_cau3_1(lichSu) {
        if (lichSu.length < 8) return null;
        if (lichSu[0] === lichSu[1] && lichSu[1] === lichSu[2] && lichSu[3] !== lichSu[2]) {
            if (lichSu[4] === lichSu[5] && lichSu[5] === lichSu[6]) {
                return { pred: lichSu[3], doTinCay: 73, lyDo: "Cầu 3-1 → bẻ sau bệt" };
            }
        }
        return null;
    }
    
    tt7_cau1_3(lichSu) {
        if (lichSu.length < 8) return null;
        if (lichSu[0] !== lichSu[1] && lichSu[1] !== lichSu[2] && lichSu[2] === lichSu[3] && lichSu[3] === lichSu[4]) {
            return { pred: lichSu[2], doTinCay: 71, lyDo: "Cầu 1-3 → theo đà" };
        }
        return null;
    }
    
    tt8_cau3_2(lichSu) {
        if (lichSu.length < 10) return null;
        if (lichSu[0] === lichSu[1] && lichSu[1] === lichSu[2] && lichSu[3] === lichSu[4]) {
            if (lichSu[5] === lichSu[6] && lichSu[6] === lichSu[7] && lichSu[8] === lichSu[9]) {
                return { pred: lichSu[3] === "Tài" ? "Xỉu" : "Tài", doTinCay: 75, lyDo: "Cầu 3-2-3 → bẻ nhịp" };
            }
        }
        return null;
    }
    
    tt9_cau2_3(lichSu) {
        if (lichSu.length < 10) return null;
        if (lichSu[0] === lichSu[1] && lichSu[2] === lichSu[3] && lichSu[2] !== lichSu[0]) {
            if (lichSu[4] === lichSu[5] && lichSu[5] === lichSu[6]) {
                return { pred: lichSu[4], doTinCay: 72, lyDo: "Cầu 2-3 → theo nhịp chính" };
            }
        }
        return null;
    }
    
    tt10_cau3_3(lichSu) {
        if (lichSu.length < 12) return null;
        if (lichSu[0] === lichSu[1] && lichSu[1] === lichSu[2] && lichSu[3] === lichSu[4] && lichSu[4] === lichSu[5]) {
            if (lichSu[6] === lichSu[7] && lichSu[7] === lichSu[8]) {
                return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 74, lyDo: "Cầu 3-3-3 → luân phiên" };
            }
        }
        return null;
    }

    // ==========================================
    // NHÓM 2: THUẬT TOÁN THỐNG KÊ (11-20)
    // ==========================================
    
    tt11_taiNong10(lichSu) {
        if (lichSu.length < 10) return null;
        const tai10 = lichSu.slice(0,10).filter(r => r === "Tài").length;
        if (tai10 >= 7) return { pred: "Xỉu", doTinCay: 70 + (tai10-7)*4, lyDo: `Tài nóng ${tai10}/10 → bẻ Xỉu` };
        if (tai10 <= 3) return { pred: "Tài", doTinCay: 70 + (3-tai10)*4, lyDo: `Xỉu nóng ${10-tai10}/10 → bẻ Tài` };
        return null;
    }
    
    tt12_xiuNong10(lichSu) {
        if (lichSu.length < 10) return null;
        const xiu10 = lichSu.slice(0,10).filter(r => r === "Xỉu").length;
        if (xiu10 >= 7) return { pred: "Tài", doTinCay: 70 + (xiu10-7)*4, lyDo: `Xỉu nóng ${xiu10}/10 → bẻ Tài` };
        return null;
    }
    
    tt13_taiNong5(lichSu) {
        if (lichSu.length < 5) return null;
        const tai5 = lichSu.slice(0,5).filter(r => r === "Tài").length;
        if (tai5 >= 4) return { pred: "Xỉu", doTinCay: 72, lyDo: `Tài ${tai5}/5 → bẻ Xỉu` };
        if (tai5 <= 1) return { pred: "Tài", doTinCay: 68, lyDo: `Xỉu ${5-tai5}/5 → bẻ Tài` };
        return null;
    }
    
    tt14_tile20(lichSu) {
        if (lichSu.length < 20) return null;
        const tai20 = lichSu.slice(0,20).filter(r => r === "Tài").length;
        if (tai20 >= 14) return { pred: "Xỉu", doTinCay: 68, lyDo: `Tài ${tai20}/20 → cân bằng về Xỉu` };
        if (tai20 <= 6) return { pred: "Tài", doTinCay: 68, lyDo: `Xỉu ${20-tai20}/20 → cân bằng về Tài` };
        return null;
    }
    
    tt15_tile30(lichSu) {
        if (lichSu.length < 30) return null;
        const tai30 = lichSu.slice(0,30).filter(r => r === "Tài").length;
        if (tai30 >= 20) return { pred: "Xỉu", doTinCay: 66, lyDo: `Lệch Tài ${tai30}/30 → bẻ` };
        if (tai30 <= 10) return { pred: "Tài", doTinCay: 66, lyDo: `Lệch Xỉu ${30-tai30}/30 → bẻ` };
        return null;
    }
    
    tt16_xuHuong3(lichSu) {
        if (lichSu.length < 3) return null;
        const last3 = lichSu.slice(0,3);
        const tai3 = last3.filter(r => r === "Tài").length;
        if (tai3 >= 2) return { pred: "Tài", doTinCay: 58, lyDo: `Xu hướng Tài ${tai3}/3` };
        return { pred: "Xỉu", doTinCay: 58, lyDo: `Xu hướng Xỉu ${3-tai3}/3` };
    }
    
    tt17_xuHuong5(lichSu) {
        if (lichSu.length < 5) return null;
        const last5 = lichSu.slice(0,5);
        const tai5 = last5.filter(r => r === "Tài").length;
        if (tai5 >= 3) return { pred: "Tài", doTinCay: 62, lyDo: `Xu hướng Tài ${tai5}/5` };
        return { pred: "Xỉu", doTinCay: 62, lyDo: `Xu hướng Xỉu ${5-tai5}/5` };
    }
    
    tt18_chuKy8(lichSu) {
        if (lichSu.length < 16) return null;
        const c1 = lichSu.slice(0,8).join('');
        const c2 = lichSu.slice(8,16).join('');
        if (c1 === c2) return { pred: c1[0] === "T" ? "Tài" : "Xỉu", doTinCay: 74, lyDo: "Chu kỳ 8 phiên lặp lại" };
        return null;
    }
    
    tt19_chuKy13(lichSu) {
        if (lichSu.length < 26) return null;
        const c1 = lichSu.slice(0,13).join('');
        const c2 = lichSu.slice(13,26).join('');
        if (c1 === c2) return { pred: c1[0] === "T" ? "Tài" : "Xỉu", doTinCay: 72, lyDo: "Chu kỳ 13 phiên lặp lại" };
        return null;
    }
    
    tt20_hoiQuyTrungBinh(lichSu) {
        if (lichSu.length < 20) return null;
        const tai20 = lichSu.slice(0,20).filter(r => r === "Tài").length;
        const doLech = tai20 - 10;
        if (Math.abs(doLech) >= 4) {
            return { pred: doLech > 0 ? "Xỉu" : "Tài", doTinCay: 65, lyDo: `Hồi quy sau lệch ${doLech}` };
        }
        return null;
    }

    // ==========================================
    // NHÓM 3: THUẬT TOÁN DỰA TRÊN PATTERN LẶP (21-30)
    // ==========================================
    
    tt21_pattern3Lap(lichSu) {
        if (lichSu.length < 9) return null;
        const p3 = lichSu.slice(0,3);
        if (lichSu.slice(3,6).join('') === p3.join('') && lichSu.slice(6,9).join('') === p3.join('')) {
            return { pred: p3[2] === "Tài" ? "Xỉu" : "Tài", doTinCay: 78, lyDo: "Pattern 3 phiên lặp 3 lần → bẻ" };
        }
        return null;
    }
    
    tt22_pattern4Lap(lichSu) {
        if (lichSu.length < 12) return null;
        const p4 = lichSu.slice(0,4);
        if (lichSu.slice(4,8).join('') === p4.join('') && lichSu.slice(8,12).join('') === p4.join('')) {
            return { pred: p4[3] === "Tài" ? "Xỉu" : "Tài", doTinCay: 80, lyDo: "Pattern 4 phiên lặp 3 lần → bẻ" };
        }
        return null;
    }
    
    tt23_pattern5Lap(lichSu) {
        if (lichSu.length < 15) return null;
        const p5 = lichSu.slice(0,5);
        if (lichSu.slice(5,10).join('') === p5.join('') && lichSu.slice(10,15).join('') === p5.join('')) {
            return { pred: p5[4] === "Tài" ? "Xỉu" : "Tài", doTinCay: 82, lyDo: "Pattern 5 phiên lặp 3 lần → bẻ chắc" };
        }
        return null;
    }
    
    tt24_doiXungGuong(lichSu) {
        if (lichSu.length < 10) return null;
        let isMirror = true;
        for (let i = 0; i < 5; i++) {
            if (lichSu[i] !== lichSu[9-i]) { isMirror = false; break; }
        }
        if (isMirror) return { pred: lichSu[5] === "Tài" ? "Xỉu" : "Tài", doTinCay: 76, lyDo: "Cầu đối xứng gương → bẻ" };
        return null;
    }
    
    tt25_patternABC(lichSu) {
        if (lichSu.length < 12) return null;
        const abc = lichSu.slice(0,3);
        let match = 0;
        for (let i = 3; i < 12; i+=3) {
            if (lichSu[i] === abc[0] && lichSu[i+1] === abc[1] && lichSu[i+2] === abc[2]) match++;
        }
        if (match >= 2) return { pred: abc[2] === "Tài" ? "Xỉu" : "Tài", doTinCay: 77, lyDo: "Pattern ABC lặp → bẻ" };
        return null;
    }
    
    tt26_patternABA(lichSu) {
        if (lichSu.length < 12) return null;
        const aba = [lichSu[0], lichSu[1], lichSu[0]];
        let match = 0;
        for (let i = 3; i < 12; i+=3) {
            if (lichSu[i] === aba[0] && lichSu[i+1] === aba[1] && lichSu[i+2] === aba[2]) match++;
        }
        if (match >= 2) return { pred: aba[2] === "Tài" ? "Xỉu" : "Tài", doTinCay: 75, lyDo: "Pattern ABA lặp → bẻ" };
        return null;
    }
    
    tt27_cayThong(lichSu) {
        if (lichSu.length < 15) return null;
        let segments = [];
        let j = 0;
        while (j < lichSu.length && segments.length < 5) {
            let count = 1;
            while (j + count < lichSu.length && lichSu[j] === lichSu[j+count]) count++;
            segments.push({ val: lichSu[j], len: count });
            j += count;
        }
        if (segments.length >= 3) {
            let tang = true;
            for (let i = 1; i < segments.length; i++) {
                if (segments[i].len <= segments[i-1].len) { tang = false; break; }
            }
            if (tang) return { pred: segments[segments.length-1].val === "Tài" ? "Xỉu" : "Tài", doTinCay: 73, lyDo: "Cây thông (độ dài tăng dần) → bẻ" };
        }
        return null;
    }
    
    tt28_xuongCa(lichSu) {
        if (lichSu.length < 15) return null;
        let segments = [];
        let j = 0;
        while (j < lichSu.length && segments.length < 5) {
            let count = 1;
            while (j + count < lichSu.length && lichSu[j] === lichSu[j+count]) count++;
            segments.push({ val: lichSu[j], len: count });
            j += count;
        }
        if (segments.length >= 3) {
            let giam = true;
            for (let i = 1; i < segments.length; i++) {
                if (segments[i].len >= segments[i-1].len) { giam = false; break; }
            }
            if (giam) return { pred: segments[segments.length-1].val, doTinCay: 72, lyDo: "Xương cá (độ dài giảm dần) → theo" };
        }
        return null;
    }
    
    tt29_pattern123(lichSu) {
        if (lichSu.length < 12) return null;
        if (lichSu[0] === lichSu[1] && lichSu[2] !== lichSu[1] && lichSu[3] === lichSu[4] && lichSu[4] === lichSu[5]) {
            if (lichSu[6] !== lichSu[5] && lichSu[7] === lichSu[8] && lichSu[8] === lichSu[9] && lichSu[9] === lichSu[10]) {
                return { pred: "Xỉu", doTinCay: 74, lyDo: "Pattern 1-2-3 → bẻ" };
            }
        }
        return null;
    }
    
    tt30_nhiPhan(lichSu) {
        if (lichSu.length < 10) return null;
        let isBinary = true;
        for (let i = 1; i < 10; i++) {
            if (lichSu[i] === lichSu[i-1]) { isBinary = false; break; }
        }
        if (isBinary) return { pred: lichSu[9] === "Tài" ? "Xỉu" : "Tài", doTinCay: 80, lyDo: "Pattern xen kẽ tuyệt đối → bẻ" };
        return null;
    }

    // ==========================================
    // NHÓM 4: THUẬT TOÁN HỌC MÁY & CHUỖI (31-40)
    // ==========================================
    
    tt31_markov1(lichSu) {
        if (lichSu.length < 15) return null;
        const map = new Map();
        for (let i = 0; i < lichSu.length - 1; i++) {
            const key = lichSu[i];
            const next = lichSu[i+1];
            if (!map.has(key)) map.set(key, { Tai: 0, Xiu: 0 });
            if (next === "Tài") map.get(key).Tai++;
            else map.get(key).Xiu++;
        }
        const last = lichSu[0];
        const stats = map.get(last);
        if (stats && stats.Tai + stats.Xiu >= 3) {
            const pred = stats.Tai > stats.Xiu ? "Tài" : "Xỉu";
            return { pred, doTinCay: 65, lyDo: `Markov: ${last} → ${pred}` };
        }
        return null;
    }
    
    tt32_markov2(lichSu) {
        if (lichSu.length < 20) return null;
        const map = new Map();
        for (let i = 0; i < lichSu.length - 2; i++) {
            const key = `${lichSu[i]},${lichSu[i+1]}`;
            const next = lichSu[i+2];
            if (!map.has(key)) map.set(key, { Tai: 0, Xiu: 0 });
            if (next === "Tài") map.get(key).Tai++;
            else map.get(key).Xiu++;
        }
        const lastKey = `${lichSu[0]},${lichSu[1]}`;
        const stats = map.get(lastKey);
        if (stats && stats.Tai + stats.Xiu >= 2) {
            const pred = stats.Tai > stats.Xiu ? "Tài" : "Xỉu";
            return { pred, doTinCay: 68, lyDo: `Markov bậc 2: (${lichSu[0]},${lichSu[1]}) → ${pred}` };
        }
        return null;
    }
    
    tt33_markov3(lichSu) {
        if (lichSu.length < 25) return null;
        const map = new Map();
        for (let i = 0; i < lichSu.length - 3; i++) {
            const key = `${lichSu[i]},${lichSu[i+1]},${lichSu[i+2]}`;
            const next = lichSu[i+3];
            if (!map.has(key)) map.set(key, { Tai: 0, Xiu: 0 });
            if (next === "Tài") map.get(key).Tai++;
            else map.get(key).Xiu++;
        }
        const lastKey = `${lichSu[0]},${lichSu[1]},${lichSu[2]}`;
        const stats = map.get(lastKey);
        if (stats && stats.Tai + stats.Xiu >= 2) {
            const pred = stats.Tai > stats.Xiu ? "Tài" : "Xỉu";
            return { pred, doTinCay: 72, lyDo: `Markov bậc 3 → ${pred}` };
        }
        return null;
    }
    
    tt34_fibonacci(lichSu) {
        const fibs = [2, 3, 5, 8, 13];
        for (let fib of fibs) {
            if (lichSu.length > fib) {
                if (lichSu[0] === lichSu[fib]) {
                    return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 70, lyDo: `Fibonacci vị trí ${fib} trùng → bẻ` };
                }
            }
        }
        return null;
    }
    
    tt35_soNguyenTo(lichSu) {
        const primes = [2, 3, 5, 7, 11, 13, 17, 19];
        for (let p of primes) {
            if (lichSu.length > p && lichSu[0] === lichSu[p]) {
                return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 68, lyDo: `Vị trí số nguyên tố ${p} trùng → bẻ` };
            }
        }
        return null;
    }
    
    tt36_soLe(lichSu) {
        const odds = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
        let trung = 0;
        for (let o of odds) {
            if (lichSu.length > o && lichSu[0] === lichSu[o]) trung++;
        }
        if (trung >= 3) return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 72, lyDo: `Nhiều vị trí lẻ trùng (${trung}) → bẻ` };
        return null;
    }
    
    tt37_soChan(lichSu) {
        const evens = [2, 4, 6, 8, 10, 12, 14, 16, 18];
        let trung = 0;
        for (let e of evens) {
            if (lichSu.length > e && lichSu[0] === lichSu[e]) trung++;
        }
        if (trung >= 3) return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 71, lyDo: `Nhiều vị trí chẵn trùng (${trung}) → bẻ` };
        return null;
    }
    
    tt38_entropyCao(lichSu) {
        if (lichSu.length < 20) return null;
        const last20 = lichSu.slice(0,20);
        const tai20 = last20.filter(r => r === "Tài").length;
        const p = tai20 / 20;
        if (p > 0.45 && p < 0.55) {
            return { pred: lichSu[0] === "Tài" ? "Xỉu" : "Tài", doTinCay: 65, lyDo: "Entropy cao (hỗn loạn) → đánh ngược" };
        }
        return null;
    }
    
    tt39_entropyThap(lichSu) {
        if (lichSu.length < 20) return null;
        const last20 = lichSu.slice(0,20);
        const tai20 = last20.filter(r => r === "Tài").length;
        const p = tai20 / 20;
        if (p >= 0.7 || p <= 0.3) {
            return { pred: p >= 0.7 ? "Xỉu" : "Tài", doTinCay: 72, lyDo: "Entropy thấp (xu hướng rõ) → bẻ cầu" };
        }
        return null;
    }
    
    tt40_momentum(lichSu) {
        if (lichSu.length < 15) return null;
        const last5 = lichSu.slice(0,5).filter(r => r === "Tài").length;
        const prev5 = lichSu.slice(5,10).filter(r => r === "Tài").length;
        const diff = last5 - prev5;
        if (diff >= 2) return { pred: "Xỉu", doTinCay: 66, lyDo: `Momentum giảm mạnh (${diff}) → bẻ` };
        if (diff <= -2) return { pred: "Tài", doTinCay: 66, lyDo: `Momentum tăng mạnh (${diff}) → bẻ` };
        return null;
    }

    // ==========================================
    // NHÓM 5: THUẬT TOÁN CHỈ BÁO KỸ THUẬT (41-47)
    // ==========================================
    
    tt41_rsi(lichSu) {
        if (lichSu.length < 14) return null;
        let up = 0, down = 0;
        for (let i = 0; i < 13; i++) {
            if (lichSu[i] === "Tài") up++;
            else down++;
        }
        const rs = up / (down + 0.01);
        const rsi = 100 - (100 / (1 + rs));
        if (rsi >= 70) return { pred: "Xỉu", doTinCay: 70, lyDo: `RSI quá mua (${rsi.toFixed(0)}) → bẻ Xỉu` };
        if (rsi <= 30) return { pred: "Tài", doTinCay: 70, lyDo: `RSI quá bán (${rsi.toFixed(0)}) → bẻ Tài` };
        return null;
    }
    
    tt42_macd(lichSu) {
        if (lichSu.length < 26) return null;
        const ema12 = lichSu.slice(0,12).filter(r => r === "Tài").length / 12;
        const ema26 = lichSu.slice(0,26).filter(r => r === "Tài").length / 26;
        const macd = ema12 - ema26;
        if (macd > 0.15) return { pred: "Xỉu", doTinCay: 67, lyDo: "MACD cắt xuống → Xỉu" };
        if (macd < -0.15) return { pred: "Tài", doTinCay: 67, lyDo: "MACD cắt lên → Tài" };
        return null;
    }
    
    tt43_bollinger(lichSu) {
        if (lichSu.length < 20) return null;
        const tai20 = lichSu.slice(0,20).filter(r => r === "Tài").length;
        const mean = tai20 / 20;
        const variance = lichSu.slice(0,20).reduce((sum, r) => sum + Math.pow((r === "Tài" ? 1 : 0) - mean, 2), 0) / 20;
        const std = Math.sqrt(variance);
        const upper = mean + 2 * std;
        const lower = mean - 2 * std;
        const current = lichSu[0] === "Tài" ? 1 : 0;
        if (current > upper) return { pred: "Xỉu", doTinCay: 68, lyDo: "Chạm dải trên BB → bẻ Xỉu" };
        if (current < lower) return { pred: "Tài", doTinCay: 68, lyDo: "Chạm dải dưới BB → bẻ Tài" };
        return null;
    }
    
    tt44_stochastic(lichSu) {
        if (lichSu.length < 14) return null;
        const last14 = lichSu.slice(0,14);
        const tai14 = last14.filter(r => r === "Tài").length;
        const k = (tai14 / 14) * 100;
        if (k >= 80) return { pred: "Xỉu", doTinCay: 66, lyDo: `Stoch K=${k.toFixed(0)} quá mua → Xỉu` };
        if (k <= 20) return { pred: "Tài", doTinCay: 66, lyDo: `Stoch K=${k.toFixed(0)} quá bán → Tài` };
        return null;
    }
    
    tt45_ma5_ma10(lichSu) {
        if (lichSu.length < 15) return null;
        const ma5 = lichSu.slice(0,5).filter(r => r === "Tài").length / 5;
        const ma10 = lichSu.slice(0,10).filter(r => r === "Tài").length / 10;
        if (ma5 > ma10 + 0.2) return { pred: "Xỉu", doTinCay: 65, lyDo: "MA5 cắt xuống MA10 → Xỉu" };
        if (ma5 < ma10 - 0.2) return { pred: "Tài", doTinCay: 65, lyDo: "MA5 cắt lên MA10 → Tài" };
        return null;
    }
    
    tt46_ma10_ma20(lichSu) {
        if (lichSu.length < 25) return null;
        const ma10 = lichSu.slice(0,10).filter(r => r === "Tài").length / 10;
        const ma20 = lichSu.slice(0,20).filter(r => r === "Tài").length / 20;
        if (ma10 > ma20 + 0.15) return { pred: "Xỉu", doTinCay: 64, lyDo: "Xu hướng ngắn hạn quá nóng → Xỉu" };
        if (ma10 < ma20 - 0.15) return { pred: "Tài", doTinCay: 64, lyDo: "Xu hướng ngắn hạn quá lạnh → Tài" };
        return null;
    }
    
    tt47_giaoCatKimCuong(lichSu) {
        if (lichSu.length < 20) return null;
        const last10 = lichSu.slice(0,10).filter(r => r === "Tài").length;
        const prev10 = lichSu.slice(10,20).filter(r => r === "Tài").length;
        if (last10 >= 7 && prev10 <= 3) return { pred: "Xỉu", doTinCay: 75, lyDo: "Giao cắt kim cương (đảo chiều mạnh) → Xỉu" };
        if (last10 <= 3 && prev10 >= 7) return { pred: "Tài", doTinCay: 75, lyDo: "Giao cắt kim cương (đảo chiều mạnh) → Tài" };
        return null;
    }

    // ==========================================
    // NHÓM 6: THUẬT TOÁN DỰA TRÊN LỊCH SỬ API (48-52)
    // ==========================================
    
    tt48_doChinhXacGanDay() {
        const recent = this.apiHistory.slice(0, 15);
        const dung = recent.filter(p => p.ket_qua === "✅ ĐÚNG").length;
        const sai = recent.filter(p => p.ket_qua === "❌ SAI").length;
        if (sai >= 5) {
            const lastApiPred = this.apiHistory[0]?.du_doan;
            if (lastApiPred) return { pred: lastApiPred === "Tài" ? "Xỉu" : "Tài", doTinCay: 72, lyDo: `API sai ${sai}/15 gần đây → đánh ngược` };
        }
        if (dung >= 10) {
            const lastApiPred = this.apiHistory[0]?.du_doan;
            if (lastApiPred) return { pred: lastApiPred, doTinCay: 70, lyDo: `API đúng ${dung}/15 → theo API` };
        }
        return null;
    }
    
    tt49_xuHuongDungSaiAPI() {
        const ganDay = this.apiHistory.slice(0, 10);
        let dungCount = 0, saiCount = 0;
        let chuoiDung = 0, chuoiSai = 0;
        for (let p of ganDay) {
            if (p.ket_qua === "✅ ĐÚNG") { dungCount++; chuoiDung++; chuoiSai = 0; }
            else if (p.ket_qua === "❌ SAI") { saiCount++; chuoiSai++; chuoiDung = 0; }
        }
        if (chuoiSai >= 3) {
            const lastApiPred = this.apiHistory[0]?.du_doan;
            if (lastApiPred) return { pred: lastApiPred === "Tài" ? "Xỉu" : "Tài", doTinCay: 74, lyDo: `API sai ${chuoiSai} phiên liên tiếp → đánh ngược` };
        }
        if (chuoiDung >= 4) {
            const lastApiPred = this.apiHistory[0]?.du_doan;
            if (lastApiPred) return { pred: lastApiPred, doTinCay: 73, lyDo: `API đúng ${chuoiDung} phiên liên tiếp → theo API` };
        }
        return null;
    }
    
    tt50_doTinCayTB() {
        const ganDay = this.apiHistory.slice(0, 20);
        let tongDoTinCay = 0;
        let dem = 0;
        for (let p of ganDay) {
            const tc = parseInt(p.do_tin_cay);
            if (!isNaN(tc)) { tongDoTinCay += tc; dem++; }
        }
        if (dem > 0) {
            const tb = tongDoTinCay / dem;
            if (tb >= 80) {
                const lastApiPred = this.apiHistory[0]?.du_doan;
                if (lastApiPred) return { pred: lastApiPred, doTinCay: 75, lyDo: `API có độ tin cậy TB cao (${tb.toFixed(0)}%) → theo API` };
            }
            if (tb <= 50 && dem >= 10) {
                const lastApiPred = this.apiHistory[0]?.du_doan;
                if (lastApiPred) return { pred: lastApiPred === "Tài" ? "Xỉu" : "Tài", doTinCay: 68, lyDo: `API độ tin cậy TB thấp (${tb.toFixed(0)}%) → đánh ngược` };
            }
        }
        return null;
    }
    
    tt51_phienSaiGanNhat() {
        for (let i = 0; i < this.apiHistory.length; i++) {
            if (this.apiHistory[i].ket_qua === "❌ SAI") {
                const nextPred = this.apiHistory[i].du_doan;
                if (nextPred) return { pred: nextPred === "Tài" ? "Xỉu" : "Tài", doTinCay: 69, lyDo: `Sau phiên sai gần nhất → đánh ngược lại` };
            }
        }
        return null;
    }
    
    tt52_chuoiDungSaiAPI() {
        let maxDung = 0, maxSai = 0;
        let curDung = 0, curSai = 0;
        for (let p of this.apiHistory) {
            if (p.ket_qua === "✅ ĐÚNG") { curDung++; curSai = 0; maxDung = Math.max(maxDung, curDung); }
            else if (p.ket_qua === "❌ SAI") { curSai++; curDung = 0; maxSai = Math.max(maxSai, curSai); }
        }
        if (maxSai >= 4) {
            const lastApiPred = this.apiHistory[0]?.du_doan;
            if (lastApiPred) return { pred: lastApiPred === "Tài" ? "Xỉu" : "Tài", doTinCay: 76, lyDo: `API từng sai ${maxSai} phiên liên tiếp → đánh ngược` };
        }
        return null;
    }

    // ==========================================
    // NHÓM 7: THUẬT TOÁN TỔNG HỢP (53-54)
    // ==========================================
    
    tt53_tongHopTrongSo(lichSu) {
        let diemTai = 0, diemXiu = 0;
        let soTT = 0;
        
        for (let i = 1; i <= 52; i++) {
            const func = this[`tt${i}`];
            if (typeof func === 'function') {
                let result = null;
                try {
                    if (i >= 48 && i <= 52) result = func.call(this);
                    else result = func.call(this, lichSu);
                } catch(e) {}
                
                if (result && result.pred) {
                    soTT++;
                    const trongSo = this.trongSoThuậtToan[`tt${i}`] || 1.0;
                    if (result.pred === "Tài") diemTai += result.doTinCay * trongSo;
                    else diemXiu += result.doTinCay * trongSo;
                }
            }
        }
        
        if (soTT === 0) return null;
        
        const finalPred = diemTai > diemXiu ? "Tài" : "Xỉu";
        let doTinCay = Math.abs(diemTai - diemXiu) / (diemTai + diemXiu) * 100;
        doTinCay = Math.min(92, Math.max(55, doTinCay));
        
        return { pred: finalPred, doTinCay: Math.round(doTinCay), lyDo: `Tổng hợp ${soTT}/52 thuật toán` };
    }
    
    tt54_sieuTongHop(lichSu) {
        const ketQuaThuong = this.tt53_tongHopTrongSo(lichSu);
        if (!ketQuaThuong) return { pred: "Tài", doTinCay: 55, lyDo: "Chưa đủ thuật toán chạy" };
        
        const tongDung = this.learningStats.dung;
        const tongSai = this.learningStats.sai;
        const tiLeThucTe = tongDung + tongSai > 0 ? (tongDung / (tongDung + tongSai)) * 100 : 50;
        
        let doTinCayDieuChinh = ketQuaThuong.doTinCay;
        if (tiLeThucTe < 40) doTinCayDieuChinh = Math.max(48, doTinCayDieuChinh - 15);
        if (tiLeThucTe > 60) doTinCayDieuChinh = Math.min(92, doTinCayDieuChinh + 5);
        
        return {
            pred: ketQuaThuong.pred,
            doTinCay: Math.round(doTinCayDieuChinh),
            lyDo: `${ketQuaThuong.lyDo} | TL thực tế ${tiLeThucTe.toFixed(0)}%`
        };
    }

    // ==========================================
    // HÀM CHÍNH
    // ==========================================
    
    async fetchAndAnalyzeHistory(apiUrl) {
        try {
            const response = await axios.get(apiUrl, { timeout: 10000 });
            const data = response.data;
            
            if (data && data.lichSuDuDoan) {
                this.apiHistory = data.lichSuDuDoan;
                this.ketQuaThucTe = this.apiHistory.filter(h => h.thuc_te !== "Chưa có").map(h => h.thuc_te);
                
                const dung = this.apiHistory.filter(h => h.ket_qua === "✅ ĐÚNG").length;
                const sai = this.apiHistory.filter(h => h.ket_qua === "❌ SAI").length;
                this.learningStats = { dung, sai, tiLe: dung + sai > 0 ? (dung / (dung + sai)) * 100 : 0 };
                
                this.tichLuyCau();
            }
            return data;
        } catch (error) {
            console.error("Lỗi fetch API:", error.message);
            return null;
        }
    }
    
    tichLuyCau() {
        const results = this.ketQuaThucTe;
        if (results.length < 3) return;
        
        let streak = 1;
        for (let i = 1; i < results.length; i++) {
            if (results[i] === results[i-1]) streak++;
            else break;
        }
        if (streak >= 2) {
            this.bridgeData.unshift({
                type: "Cầu bệt", value: results[0], length: streak,
                lastSeen: this.apiHistory[0]?.phien, reliability: Math.min(80, 50 + streak * 10)
            });
        }
        
        if (this.bridgeData.length > 20) this.bridgeData.pop();
    }
    
    async getFinalPrediction(apiUrl) {
        const originalData = await this.fetchAndAnalyzeHistory(apiUrl);
        if (!originalData) return { error: "Không thể lấy dữ liệu từ API gốc" };
        
        const lichSu = this.ketQuaThucTe;
        if (lichSu.length === 0) return { error: "Chưa có kết quả thực tế nào" };
        
        const ketQua = this.tt54_sieuTongHop(lichSu);
        
        return {
            timestamp: new Date().toISOString(),
            phien_hien_tai: originalData.phienHienTai,
            ketQuaTruoc: originalData.ketQuaTruoc,
            duDoan: {
                du_doan: ketQua.pred,
                do_tin_cay: `${ketQua.doTinCay}%`,
                giai_thich: ketQua.lyDo
            },
            thongKe: this.learningStats,
            so_thuat_toan_da_dung: 54,
            author: "@tranhoang2286"
        };
    }
}

// ==========================================
// KHỞI TẠO API
// ==========================================

const analyzer = new SieuThuậtToanTaiXiu();

// Endpoint gốc - QUAN TRỌNG: tránh lỗi "Not Found"
app.get('/', (req, res) => {
    res.json({
        name: "🚀 SIÊU THUẬT TOÁN TÀI XỈU - 54 THUẬT TOÁN",
        author: "@tranhoang2286",
        version: "3.0",
        status: "online",
        endpoints: {
            "Dự đoán chính (54 thuật toán)": "/sunwin/tx-vip",
            "Cầu đã tích lũy": "/sunwin/cau-da-tich-luy",
            "Thống kê học tập": "/sunwin/thong-ke-hoc-tap",
            "API gốc (proxy)": "/sunwin/tx"
        },
        huong_dan: "Gọi /sunwin/tx-vip để nhận dự đoán"
    });
});

// Endpoint dự đoán chính
app.get('/sunwin/tx-vip', async (req, res) => {
    try {
        const result = await analyzer.getFinalPrediction(API_GOC);
        if (result.error) return res.status(503).json({ error: result.error });
        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint xem cầu tích lũy
app.get('/sunwin/cau-da-tich-luy', async (req, res) => {
    try {
        await analyzer.fetchAndAnalyzeHistory(API_GOC);
        res.json({ success: true, cau_da_tich_luy: analyzer.bridgeData, tong_so_cau: analyzer.bridgeData.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint thống kê học tập
app.get('/sunwin/thong-ke-hoc-tap', async (req, res) => {
    try {
        await analyzer.fetchAndAnalyzeHistory(API_GOC);
        res.json({ success: true, thong_ke: analyzer.learningStats });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint proxy API gốc
app.get('/sunwin/tx', async (req, res) => {
    try {
        const response = await axios.get(API_GOC, { timeout: 10000 });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Khởi động server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 SIÊU THUẬT TOÁN TÀI XỈU - ${PORT}`);
    console.log(`📡 54 thuật toán | 7 nhóm phân tích`);
    console.log(`✅ Endpoint gốc: http://localhost:${PORT}/`);
    console.log(`🎯 Dự đoán: http://localhost:${PORT}/sunwin/tx-vip`);
});
