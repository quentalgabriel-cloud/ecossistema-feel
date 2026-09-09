# Feel System — Quick Start Guide & Code Snippets

**Comece daqui se quiser implementar agora.**

---

## 0. Setup Inicial (5 minutos)

```bash
# 1. Criar projeto Next.js
npx create-next-app@latest feel-system \
  --typescript \
  --tailwind \
  --app \
  --no-eslint

cd feel-system

# 2. Instalar Framer Motion
npm install framer-motion

# 3. Adicionar fontes (baixar de Google Fonts)
# - Archivo Black (900)
# - Inter (400, 500, 700)
# - IBM Plex Mono (400)

# 4. Iniciar dev server
npm run dev
# Abre http://localhost:3000
```

---

## 1. Tailwind Config com Design Tokens Feel

**`tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: '#fafaf6',
        card: '#ffffff',
        ink: '#16151d',
        ink2: '#5c5a66',
        ink3: '#74727d',
        line: '#e8e6dd',
        violet: '#6c5bff',
        'violet-deep': '#2b1fa8',
        'violet-soft': '#efedff',
        ember: '#ff5a2d',
        ok: '#117a53',
        // Ritmo scale
        'ritmo-0': '#f0efe8',
        'ritmo-1': '#dcd8fb',
        'ritmo-2': '#a99cff',
        'ritmo-3': '#6c5bff',
        'ritmo-4': '#2b1fa8',
      },
      fontFamily: {
        display: ['var(--font-archivo)'],
        body: ['var(--font-inter)'],
        mono: ['var(--font-plex-mono)'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
      },
      spacing: {
        'screen-vh': '100vh',
        'section': '20vh',
      },
    },
  },
  plugins: [],
};

export default config;
```

**`app/layout.tsx`** (com fontes)

```typescript
import { Archivo_Black, Inter, IBM_Plex_Mono } from 'next/font/google';

const archivo = Archivo_Black({
  weight: '900',
  variable: '--font-archivo',
  subsets: ['latin'],
});

const inter = Inter({
  weight: ['400', '500', '700'],
  variable: '--font-inter',
  subsets: ['latin'],
});

const plex = IBM_Plex_Mono({
  weight: '400',
  variable: '--font-plex-mono',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${inter.variable} ${plex.variable}`}>
      <body className="bg-paper text-ink font-body">
        {children}
      </body>
    </html>
  );
}
```

---

## 2. Hero Section (Tela 1)

**`components/sections/HeroSection.tsx`**

```tsx
'use client';

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <div className="h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background parallax (opcional) */}
      <div className="absolute inset-0 bg-gradient-to-b from-paper to-violet-soft opacity-20 -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center"
      >
        {/* Logo / Brand */}
        <h1 className="font-display text-6xl sm:text-8xl font-black text-violet mb-8">
          FEEL
        </h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-ink text-lg sm:text-xl font-body max-w-xl mx-auto leading-relaxed"
        >
          Transforming problems into capabilities, execution and intelligence.
        </motion.p>

        {/* Chevron hint */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-12"
        >
          <p className="text-ink3 text-sm">↓ scroll to explore</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
```

---

## 3. ConceptNode Component

**`components/ui/ConceptNode.tsx`**

```tsx
'use client';

import { motion } from 'framer-motion';

interface ConceptNodeProps {
  id: string;
  label: string;
  color?: 'violet' | 'violet-deep' | 'violet-soft' | 'ink';
  size?: 'sm' | 'md' | 'lg';
  isActive?: boolean;
  onClick?: () => void;
}

const sizeMap = {
  sm: 'w-12 h-12 text-xs',
  md: 'w-20 h-20 text-sm',
  lg: 'w-28 h-28 text-base',
};

const colorMap = {
  violet: 'bg-violet text-white',
  'violet-deep': 'bg-violet-deep text-white',
  'violet-soft': 'bg-violet-soft text-violet-deep',
  ink: 'bg-ink text-white',
};

export function ConceptNode({
  id,
  label,
  color = 'violet',
  size = 'md',
  isActive = false,
  onClick,
}: ConceptNodeProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={
        isActive ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }
      }
      whileHover={{ scale: 1.1 }}
      transition={{
        scale: { duration: 0.4, ease: 'easeOut' },
        opacity: { duration: 0.3 },
      }}
      className={`
        rounded-full font-bold flex items-center justify-center
        transition-shadow duration-300
        ${sizeMap[size]} ${colorMap[color]}
        hover:shadow-lg
      `}
      onClick={onClick}
      style={{
        boxShadow: isActive ? `0 0 30px rgba(108, 91, 255, 0.5)` : 'none',
      }}
    >
      {label}
    </motion.button>
  );
}
```

---

## 4. ConnectionLine Component (SVG)

**`components/ui/ConnectionLine.tsx`**

```tsx
'use client';

import { motion } from 'framer-motion';

interface ConnectionLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  isActive?: boolean;
}

export function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  isActive = false,
}: ConnectionLineProps) {
  const pathLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 500"
      preserveAspectRatio="none"
    >
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth="2"
        className="text-violet opacity-40"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isActive ? { pathLength: 1, opacity: 1 } : {}}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
        strokeDasharray={pathLength}
        strokeLinecap="round"
      />
    </svg>
  );
}
```

---

## 5. Interactive Diagram (Orquestrador)

**`components/ui/InteractiveDiagram.tsx`**

```tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { ConceptNode } from './ConceptNode';

interface Node {
  id: string;
  label: string;
  color: string;
}

interface Connection {
  from: string;
  to: string;
}

interface InteractiveDiagramProps {
  nodes: Node[];
  connections: Connection[];
  onNodeClick?: (id: string) => void;
}

export function InteractiveDiagram({
  nodes,
  connections,
  onNodeClick,
}: InteractiveDiagramProps) {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const [nodePositions, setNodePositions] = useState<Record<string, { x: number; y: number }>>({});

  useEffect(() => {
    // Calcular posições dos nós (simples: linear)
    const positions: Record<string, { x: number; y: number }> = {};
    const gap = 150; // px entre nós
    const startX = 50; // %

    nodes.forEach((node, idx) => {
      positions[node.id] = {
        x: startX + idx * gap,
        y: 50,
      };
    });

    setNodePositions(positions);
  }, [nodes]);

  return (
    <div ref={ref} className="relative w-full h-96 flex items-center justify-center">
      {/* Render connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn, idx) => {
          const fromPos = nodePositions[conn.from];
          const toPos = nodePositions[conn.to];

          if (!fromPos || !toPos) return null;

          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={`${fromPos.x}%`}
              y1={`${fromPos.y}%`}
              x2={`${toPos.x}%`}
              y2={`${toPos.y}%`}
              stroke="currentColor"
              strokeWidth="2"
              className="text-violet opacity-30"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                duration: 0.8,
                ease: 'easeInOut',
                delay: idx * 0.2,
              }}
            />
          );
        })}
      </svg>

      {/* Render nodes */}
      <div className="relative w-full h-full flex items-center justify-center">
        {nodes.map((node, idx) => (
          <div
            key={node.id}
            className="absolute"
            style={{
              left: `${nodePositions[node.id]?.x || 0}%`,
              top: `${nodePositions[node.id]?.y || 0}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <ConceptNode
              {...node}
              isActive={isInView}
              onClick={() => onNodeClick?.(node.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. RESOLVE Flow Section

**`components/sections/ResolveFlow.tsx`**

```tsx
'use client';

import { InteractiveDiagram } from '@/components/ui/InteractiveDiagram';
import { motion } from 'framer-motion';

const resolveNodes = [
  { id: 'problema', label: 'Problema', color: 'violet' },
  { id: 'contexto', label: 'Contexto', color: 'violet-soft' },
  { id: 'capacidade', label: 'Capacidade', color: 'violet' },
  { id: 'execucao', label: 'Execução', color: 'violet-soft' },
  { id: 'resultado', label: 'Resultado', color: 'violet' },
];

const resolveConnections = [
  { from: 'problema', to: 'contexto' },
  { from: 'contexto', to: 'capacidade' },
  { from: 'capacidade', to: 'execucao' },
  { from: 'execucao', to: 'resultado' },
];

export function ResolveFlow() {
  return (
    <section className="min-h-screen bg-paper py-20 px-4 sm:px-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
        className="font-display text-5xl sm:text-6xl font-black text-violet mb-12 text-center"
      >
        RESOLVE
      </motion.h2>

      <div className="max-w-5xl mx-auto">
        <InteractiveDiagram
          nodes={resolveNodes}
          connections={resolveConnections}
          onNodeClick={(id) => console.log('Clicked:', id)}
        />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-center text-ink2 mt-12 font-body"
        >
          Como a Feel resolve problemas através de contexto, capacidade e execução.
        </motion.p>
      </div>
    </section>
  );
}
```

---

## 7. Hook: useInViewport

**`hooks/useInViewport.ts`**

```typescript
'use client';

import { useRef, useState, useEffect } from 'react';

export function useInViewport(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, {
      threshold: 0.3,
      ...options,
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, isInView };
}
```

---

## 8. Main Page Structure

**`app/page.tsx`**

```tsx
import { HeroSection } from '@/components/sections/HeroSection';
import { ResolveFlow } from '@/components/sections/ResolveFlow';
import { ProveFlow } from '@/components/sections/ProveFlow';
import { LearnFlow } from '@/components/sections/LearnFlow';
import { ScaleFlow } from '@/components/sections/ScaleFlow';
import { ProductsIntegrationSection } from '@/components/sections/ProductsIntegrationSection';
import { EconomicsSection } from '@/components/sections/EconomicsSection';
import { FlywheelMacroSection } from '@/components/sections/FlywheelMacroSection';

export default function Home() {
  return (
    <main className="w-full">
      <HeroSection />
      
      <section id="movements">
        <ResolveFlow />
        <ProveFlow />
        <LearnFlow />
        <ScaleFlow />
      </section>

      <section id="integration">
        <ProductsIntegrationSection />
      </section>

      <section id="economics">
        <EconomicsSection />
      </section>

      <section id="flywheel">
        <FlywheelMacroSection />
      </section>
    </main>
  );
}
```

---

## 9. Modal Pattern (Intercepted Route)

**`app/(modals)/@modal/(.)prova/[id]/page.tsx`**

```tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProvaDetailProps {
  params: { id: string };
}

export default function ProvaDetail({ params }: ProvaDetailProps) {
  const router = useRouter();

  // Exemplo de dados (futuramente viriam de API)
  const prova = {
    id: params.id,
    quemFez: 'Gabriel Quental',
    oQue: 'Identidade Visual do Sistema Feel',
    paraQuem: 'Feel',
    contexto: 'Agosto 2026',
    resultado: 'Sistema de design implementado e aprovado',
    confirmadoPor: ['Feel Team', 'Gabriel Quental'],
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-black/50"
          onClick={() => router.back()}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative bg-white rounded-md shadow-lg p-8 max-w-md w-full mx-4"
        >
          <h2 className="font-display text-2xl font-black text-violet mb-4">Prova</h2>

          <div className="space-y-3 font-body text-sm text-ink">
            <p><strong>Quem fez:</strong> {prova.quemFez}</p>
            <p><strong>O quê:</strong> {prova.oQue}</p>
            <p><strong>Para quem:</strong> {prova.paraQuem}</p>
            <p><strong>Contexto:</strong> {prova.contexto}</p>
            <p><strong>Resultado:</strong> {prova.resultado}</p>
            <p><strong>Confirmado por:</strong> ✓✓ {prova.confirmadoPor.join(', ')}</p>
          </div>

          <button
            onClick={() => router.back()}
            className="mt-6 w-full py-2 bg-violet text-white rounded font-body text-sm hover:bg-violet-deep transition"
          >
            Fechar
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
```

---

## 10. Checklist de Implementação

### Fase 1: Setup (1 dia)
- [ ] Scaffold Next.js criado
- [ ] Tailwind configurado com tokens Feel
- [ ] Fontes importadas e funcionando
- [ ] Vercel projeto criado

### Fase 2: Components Base (2 dias)
- [ ] ConceptNode renderiza e faz motion
- [ ] ConnectionLine desenha com stroke
- [ ] InteractiveDiagram orquestra ambos
- [ ] HeroSection funciona
- [ ] Scroll parallax ativa

### Fase 3: Seções (3 dias)
- [ ] ResolveFlow completa e interativa
- [ ] ProveFlow com detalhe de Prova
- [ ] LearnFlow com ciclo fechado
- [ ] ScaleFlow com grafo dinâmico
- [ ] ProductsIntegrationSection com cards

### Fase 4: Modals e Polish (2 dias)
- [ ] Intercepted routes funcionam
- [ ] Modals abrem/fecham suave
- [ ] Economia e Flywheel sections
- [ ] E2E testing com Playwright
- [ ] Lighthouse audit (90+)

### Fase 5: Deploy (1 dia)
- [ ] Preview no Vercel
- [ ] Responsividade 100% checada
- [ ] Motion suave em mobile
- [ ] Deploy em produção

---

## 11. Performance Tips

```tsx
// 1. Lazy load seções fora de viewport
import dynamic from 'next/dynamic';

const FlywheelMacroSection = dynamic(
  () => import('@/components/sections/FlywheelMacroSection'),
  { ssr: false }
);

// 2. Usar Framer Motion com GPU acceleration
<motion.div style={{ willChange: 'transform' }}>
  Content
</motion.div>

// 3. Limitar parallax em mobile
const parallaxIntensity = isMobile ? 0.5 : 1;

// 4. Usar requestAnimationFrame manualmente se necessário
useMotionValueEvent(scrollY, "change", (value) => {
  // Callback happens 60fps, use sparingly
});
```

---

## 12. Deploy no Vercel

```bash
# Conectar repositório
1. Criar repo no GitHub: feel-system
2. Push código local
3. Ir a vercel.com/new
4. Importar repositório
5. Tailwind + Next.js auto-detectados
6. Deploy

# Produção
git push origin main
# Vercel auto-deploys em ~60s
```

---

## 13. Estrutura Final de Pastas

```
feel-system/
├─ app/
│  ├─ page.tsx
│  ├─ layout.tsx
│  └─ (modals)/
│     └─ @modal/(.)prova/[id]/page.tsx
│
├─ components/
│  ├─ ui/
│  │  ├─ ConceptNode.tsx
│  │  ├─ ConnectionLine.tsx
│  │  └─ InteractiveDiagram.tsx
│  │
│  └─ sections/
│     ├─ HeroSection.tsx
│     ├─ ResolveFlow.tsx
│     ├─ ProveFlow.tsx
│     ├─ LearnFlow.tsx
│     ├─ ScaleFlow.tsx
│     ├─ ProductsIntegrationSection.tsx
│     ├─ EconomicsSection.tsx
│     └─ FlywheelMacroSection.tsx
│
├─ hooks/
│  ├─ useInViewport.ts
│  ├─ useParallax.ts
│  └─ useMotionSequence.ts
│
├─ lib/
│  ├─ animations.ts
│  ├─ constants.ts
│  └─ easing.ts
│
├─ public/
│  └─ fonts/ (se downloaded localmente)
│
├─ styles/
│  └─ globals.css (Tailwind imports)
│
├─ tailwind.config.ts
├─ tsconfig.json
├─ next.config.js
└─ package.json
```

---

## Próximo Passo

1. **Execute o setup inicial** (npm install, etc)
2. **Crie a estrutura de pastas** (components, hooks, lib)
3. **Implemente ConceptNode** (é o bloco básico)
4. **Teste motion local** (`npm run dev` e veja se scale/opacity funcionam)
5. **Expanda para ConnectionLine e InteractiveDiagram**
6. **Implemente HeroSection**
7. **Implemente ResolveFlow como prototipo de seção**
8. **Replique para as outras seções (PROVE, LEARN, SCALE)**
9. **Adicione modals com intercepted routes**
10. **Polish: responsividade, performance, deploy**

**Tempo estimado:** 2–3 semanas com 1 desenvolvedor full-time (em paralelo com outras responsabilidades).

---

**Boa sorte. O sistema vivo está pronto para vir à vida.**
