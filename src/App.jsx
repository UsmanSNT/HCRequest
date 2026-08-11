import { useState } from 'react'

const initialForm = {
  contentName: '',
  age: '',
  topic: '',
  manager: '',
  phone: '',
  email: '',
  contentType: '그림책',
  fileName: '',
  description: '',
  effects: ['진동'],
  vibrationStrength: '중',
  vibrationPattern: '1회',
  vibrationDuration: '1.0초',
  audioFile: '',
  ledMode: '따뜻한 노랑',
  videoFile: '',
}

const steps = ['기본 정보', '콘텐츠 등록', '효과 설정', '요청 완료']
const contentTypes = [
  { name: '그림책', icon: 'menu_book', iconClass: 'book-gradient material-symbols-outlined' },
  { name: '이미지', icon: 'image', iconClass: 'image-gradient material-symbols-outlined' },
  { name: '영상', icon: 'live_tv', iconClass: 'video-gradient material-symbols-outlined' },
  { name: '시청각 자료', icon: 'volume_up', iconClass: 'audio-gray material-symbols-outlined' },
  { name: '기타', icon: 'more_horiz', iconClass: 'more-gray material-symbols-outlined' },
]
const effectOptions = [
  { name: '진동', image: '/vibration-icon.png', color: 'vibration-image' },
  { name: '음성', icon: 'volume_up', color: 'sound-gray', material: true },
  { name: 'LED', icon: 'lightbulb', color: 'led-yellow', material: true },
  { name: '영상 출력', icon: 'live_tv', color: 'video-green', material: true },
]

function App() {
  const [screen, setScreen] = useState('home')
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const step = screen === 'basic' ? 1 : screen === 'content' ? 2 : screen === 'effects' ? 3 : 4

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }))
  }

  const validateBasic = () => {
    const required = ['contentName', 'age', 'topic', 'manager', 'phone']
    const nextErrors = {}
    required.forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = '필수 항목을 입력해주세요.'
    })
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) setScreen('content')
  }

  const validateContent = () => {
    if (!form.fileName) {
      setErrors({ fileName: '시연을 위해 파일을 선택해주세요.' })
      return
    }
    setErrors({})
    setScreen('effects')
  }

  const toggleEffect = (name) => {
    setForm((current) => ({
      ...current,
      effects: current.effects.includes(name)
        ? current.effects.filter((effect) => effect !== name)
        : [...current.effects, name],
    }))
  }

  const reset = () => {
    setForm(initialForm)
    setErrors({})
    setScreen('home')
  }

  const startNewRequest = () => {
    setForm(initialForm)
    setErrors({})
    setScreen('basic')
  }

  return (
    <main className="app-shell">
      <section className={`phone ${screen === 'home' ? 'home-phone' : ''}`}>
        {screen === 'home' ? (
          <Home onStart={startNewRequest} />
        ) : screen === 'library' ? (
          <>
            <Header title="콘텐츠" onBack={() => setScreen('home')} />
            <VideoLibrary />
          </>
        ) : (
          <>
            <Header title={screen === 'basic' ? '새 요청서 작성' : screen === 'content' ? '콘텐츠 등록' : screen === 'effects' ? '효과 설정' : '요청 완료'} onBack={screen === 'basic' ? () => setScreen('home') : screen === 'content' ? () => setScreen('basic') : screen === 'effects' ? () => setScreen('content') : () => setScreen('effects')} />
            <Stepper current={step} />
            {screen === 'basic' && <BasicForm form={form} errors={errors} update={update} onNext={validateBasic} />}
            {screen === 'content' && <ContentForm form={form} errors={errors} update={update} onBack={() => setScreen('basic')} onNext={validateContent} />}
            {screen === 'effects' && <EffectsForm form={form} update={update} toggleEffect={toggleEffect} onBack={() => setScreen('content')} onNext={() => setScreen('complete')} />}
            {screen === 'complete' && <Complete form={form} onEdit={() => setScreen('effects')} onConfirm={reset} />}
          </>
        )}
        <BottomNav
          active={screen === 'home' ? 'home' : screen === 'library' ? 'content' : 'request'}
          onHome={() => setScreen('home')}
          onRequest={startNewRequest}
          onContent={() => setScreen('library')}
        />
      </section>
    </main>
  )
}

function Header({ title, onBack }) {
  return <header className="top-header"><button className="icon-button" onClick={onBack} aria-label="이전 화면"><span className="material-symbols-outlined">arrow_back_ios</span></button><h1>{title}</h1><span className="header-space" /></header>
}

function Home({ onStart }) {
  return (
    <div className="home-content">
      <header className="home-header"><button className="icon-button" aria-label="메뉴"><span className="material-symbols-outlined">menu</span></button><h1>햅틱 콘텐츠 요청</h1><button className="icon-button" aria-label="알림"><span className="material-symbols-outlined">notifications</span></button></header>
      <div className="hero-card">
        <div><p>기존 교육콘텐츠를<br />햅틱교구와 연동하여<br />더 생생한 학습 경험을<br />만들어보세요!</p></div>
        <div className="hero-art" aria-hidden="true"><span className="device">◉</span><span className="bear">🧸</span><span className="book">▰</span></div>
      </div>
      <button className="primary-button new-request" onClick={onStart}>＋ 새 요청서 작성</button>
      <section className="request-status">
        <div className="status-title">
          <h2>나의 요청 현황</h2>
          <button type="button">전체 보기 ›</button>
        </div>
        <div className="status-grid">
          {[
            ['edit', '작성 중', '2', 'draft'],
            ['quick_reference_all', '접수 완료', '3', 'received'],
            ['settings', '제작 중', '1', 'making'],
            ['check_circle', '완료', '5', 'finished'],
          ].map(([icon, label, count, tone]) => (
            <div className={`status-card ${tone}`} key={label}>
              <span className="material-symbols-outlined">{icon}</span>
              <small>{label}</small>
              <strong>{count}</strong>
            </div>
          ))}
        </div>
      </section>
      <section className="intro-panel">
        <span className="intro-icon">✦</span>
        <h2>새로운 학습 경험을 만들어보세요</h2>
        <p>간단한 4단계로 교육 콘텐츠에<br />다양한 햅틱 효과를 연결할 수 있어요.</p>
      </section>
    </div>
  )
}

function Stepper({ current }) {
  return (
    <div className="stepper" aria-label={`4단계 중 ${current}단계`}>
      {steps.map((label, index) => {
        const number = index + 1
        const done = number < current
        return <div className={`step ${number === current ? 'active' : ''} ${done ? 'done' : ''}`} key={label}><span>{done ? <i className="material-symbols-outlined">check</i> : number}</span><small>{label}</small></div>
      })}
    </div>
  )
}

function BasicForm({ form, errors, update, onNext }) {
  return (
    <div className="screen-content">
      <h2>1. 기본 정보</h2>
      <Field label="콘텐츠명" required error={errors.contentName}><input value={form.contentName} onChange={(e) => update('contentName', e.target.value)} placeholder="콘텐츠 이름을 입력해주세요" /></Field>
      <Field label="대상 연령" required error={errors.age}><select value={form.age} onChange={(e) => update('age', e.target.value)}><option value="">선택</option><option>3~4세</option><option>5~7세</option><option>8~10세</option></select></Field>
      <Field label="교육 주제" required error={errors.topic}><input value={form.topic} onChange={(e) => update('topic', e.target.value)} placeholder="예) 생활습관, 자연, 안전 등" /></Field>
      <Field label="담당자명" required error={errors.manager}><input value={form.manager} onChange={(e) => update('manager', e.target.value)} placeholder="이름을 입력해주세요" /></Field>
      <Field label="연락처" required error={errors.phone}><input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="010-0000-0000" /></Field>
      <Field label="이메일"><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="이메일을 입력해주세요" /></Field>
      <div className="single-action"><button className="primary-button" onClick={onNext}>다음</button></div>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return <label className={`field ${error ? 'has-error' : ''}`}><span>{label}{required && <b> *</b>}</span>{children}{error && <small className="error-text">{error}</small>}</label>
}

function ContentForm({ form, errors, update, onBack, onNext }) {
  return (
    <div className="screen-content">
      <h2>2. 기존 교육콘텐츠 등록</h2>
      <div className="section-label">콘텐츠 유형 <b>*</b></div>
      <div className="content-grid">
        {contentTypes.map((type) => <button key={type.name} className={`choice-card ${form.contentType === type.name ? 'selected' : ''}`} onClick={() => update('contentType', type.name)}><i className={type.iconClass || ''}>{type.icon}</i><span>{type.name}</span>{form.contentType === type.name && <em>✓</em>}</button>)}
      </div>
      <div className="section-label file-label">콘텐츠 파일 첨부 <b>*</b></div>
      <label className={`upload-box ${errors.fileName ? 'has-error' : ''}`}>
        <input type="file" accept="image/*,video/*,.pdf,.mp3" onChange={(e) => update('fileName', e.target.files?.[0]?.name || '')} />
        <span className="upload-icon material-symbols-outlined">backup</span>
        <strong>{form.fileName || '파일을 선택하거나 드래그하여 업로드하세요.'}</strong>
        <small>지원 형식: JPG, PNG, PDF, MP4, MOV, MP3 등</small>
      </label>
      {errors.fileName && <small className="error-text standalone">{errors.fileName}</small>}
      <Field label="콘텐츠 설명 (선택)"><textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="콘텐츠에 대한 간단한 설명을 입력해주세요" /></Field>
      <NavActions onBack={onBack} onNext={onNext} />
    </div>
  )
}

function EffectsForm({ form, update, toggleEffect, onBack, onNext }) {
  return (
    <div className="screen-content effects-screen">
      <h2>3. 효과 설정 <small>(3페이지)</small></h2>
      <p className="helper">선택한 장면에 적용할 효과를 선택하세요.</p>
      <div className="effect-list">
        {effectOptions.map((effect) => {
          const checked = form.effects.includes(effect.name)
          return (
            <div className={`effect-card ${checked ? 'enabled' : ''}`} key={effect.name}>
              <button className="effect-heading" onClick={() => toggleEffect(effect.name)} aria-pressed={checked}><span className={`check ${checked ? 'checked' : ''}`}>{checked ? '✓' : ''}</span>{effect.image ? <img className={effect.color} src={effect.image} alt="" /> : <i className={`${effect.color} ${effect.material ? 'material-symbols-outlined' : ''}`}>{effect.icon}</i>}<strong>{effect.name}</strong><span className="effect-detail">{effect.name === '음성' ? '음성 파일 선택' : effect.name === 'LED' ? '색상 / 모드 설정' : effect.name === '영상 출력' ? '영상 파일 선택' : ''}{effect.name !== '진동' && ' ›'}</span></button>
              {effect.name === '진동' && checked && <div className="vibration-options"><div><b>강도</b>{['약', '중', '강'].map((item) => <button key={item} className={form.vibrationStrength === item ? 'active-pill' : ''} onClick={() => update('vibrationStrength', item)}>{item}</button>)}</div><div className="select-row"><label>패턴<select value={form.vibrationPattern} onChange={(e) => update('vibrationPattern', e.target.value)}><option>1회</option><option>2회</option><option>반복</option></select></label><label>지속시간<select value={form.vibrationDuration} onChange={(e) => update('vibrationDuration', e.target.value)}><option>0.5초</option><option>1.0초</option><option>2.0초</option></select></label></div></div>}
              {effect.name === '음성' && checked && <label className="inline-option">음성 파일<input type="text" value={form.audioFile} onChange={(e) => update('audioFile', e.target.value)} placeholder="예: 안내음.mp3" /></label>}
              {effect.name === 'LED' && checked && <label className="inline-option">LED 모드<select value={form.ledMode} onChange={(e) => update('ledMode', e.target.value)}><option>따뜻한 노랑</option><option>초록 점멸</option><option>무지개</option></select></label>}
              {effect.name === '영상 출력' && checked && <label className="inline-option">영상 파일<input type="text" value={form.videoFile} onChange={(e) => update('videoFile', e.target.value)} placeholder="예: 안전교육.mp4" /></label>}
            </div>
          )
        })}
      </div>
      <NavActions onBack={onBack} onNext={onNext} />
    </div>
  )
}

function NavActions({ onBack, onNext }) {
  return <div className="nav-actions"><button className="secondary-button" onClick={onBack}>‹ 이전</button><button className="primary-button" onClick={onNext}>다음</button></div>
}

function VideoLibrary() {
  const videos = [1, 2, 3, 4]

  return (
    <div className="screen-content video-library">
      <h2>콘텐츠 영상</h2>
      <p className="video-library-helper">원하는 영상을 선택해 재생하세요.</p>
      <div className="video-grid">
        {videos.map((number) => (
          <article className="video-card" key={number}>
            <video controls preload="metadata" playsInline>
              <source src={`/media/video-${number}.mp4`} type="video/mp4" />
              브라우저에서 영상을 재생할 수 없습니다.
            </video>
            <strong>영상 {number}</strong>
          </article>
        ))}
      </div>
    </div>
  )
}

function Complete({ form, onEdit, onConfirm }) {
  return (
    <div className="screen-content complete-screen">
      <div className="celebration" aria-hidden="true"><span>•</span><span>✦</span><b>✓</b><span>✦</span><span>•</span></div>
      <h2>요청서가 접수되었습니다!</h2>
      <p>검토 후 담당자가 연락드리겠습니다.</p>
      <section className="summary-card">
        <div className="summary-title"><h3>요청서 요약</h3><button onClick={onEdit}>수정</button></div>
        <dl><dt>콘텐츠명</dt><dd>{form.contentName}</dd><dt>콘텐츠 유형</dt><dd>{form.contentType}</dd><dt>대상 연령</dt><dd>{form.age}</dd><dt>적용 효과</dt><dd>{form.effects.length ? form.effects.join(', ') : '없음'}</dd><dt>요청일</dt><dd>{new Intl.DateTimeFormat('ko-KR').format(new Date())}</dd></dl>
      </section>
      <button className="primary-button confirm-button" onClick={onConfirm}>확인</button>
      <button className="outline-button" type="button">내 요청서 보기</button>
    </div>
  )
}

function BottomNav({ active, onHome, onRequest, onContent }) {
  const items = [
    { id: 'home', icon: 'home', label: '홈', onClick: onHome },
    { id: 'request', icon: 'edit_document', label: '요청서', onClick: onRequest },
    { id: 'content', icon: 'pageview', label: '콘텐츠', onClick: onContent },
  ]

  return <nav className="bottom-nav">{items.map((item) => <button className={active === item.id ? 'active' : ''} key={item.id} onClick={item.onClick}><i className="material-symbols-outlined">{item.icon}</i><span>{item.label}</span></button>)}</nav>
}

export default App
