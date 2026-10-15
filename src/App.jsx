import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './App.css'

const FOTO_PROFIL =
  'https://cdn.phototourl.com/member/2026-10-15-e8235a95-e327-4d86-875b-3f25b16ae922.png'

function App() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fotoError, setFotoError] = useState(false)

  useEffect(() => {
    async function getProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Gagal mengambil proyek:', error)
        setError('Data proyek belum bisa dimuat. Silakan coba lagi nanti.')
      } else {
        setProjects(data || [])
      }

      setLoading(false)
    }

    getProjects()
  }, [])

  return (
    <div className="website">
      <header className="navbar">
        <a href="#beranda" className="brand">
          <span className="brand-icon">S</span>
          <span>Santiago<span className="brand-dot">.</span></span>
        </a>

        <nav className="nav-links">
          <a href="#beranda">Beranda</a>
          <a href="#tentang">Tentang Saya</a>
          <a href="#proyek">Proyek Game</a>
          <a href="#kabar">Kabar Terbaru</a>
          <a href="#kontak">Kontak</a>
        </nav>

        <a href="/admin" className="nav-button">
          Login ↗
        </a>
      </header>

      <main>
        <section className="hero" id="beranda">
          <div className="hero-content">
            <div className="availability">
              <span className="status-dot"></span>
              GAME DEVELOPER · SEMARANG, INDONESIA
            </div>

            <h1>
              Halo, saya <span className="highlight">Santiago Tan.</span>
              <br />
              Saya merancang dunia game
              <br />
              <span className="muted-heading">dari baris kode & imajinasi.</span>
            </h1>

            <p className="hero-description">
              Pelajar Rekayasa Perangkat Lunak yang fokus mendalami
              pengembangan game 2D pixel RPG menggunakan Godot Engine. 
              Setiap mekanik dan level adalah tantangan baru untuk ditaklukkan.
            </p>

            <div className="hero-actions">
              <a href="#proyek" className="primary-button">
                Lihat Karya Game ↗
              </a>
              <a href="#tentang" className="secondary-button">
                Kenali Saya
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <strong>RPL / SMK</strong>
                <span>Jurusan Saya</span>
              </div>
              <div>
                <strong>Godot & GDScript</strong>
                <span>Mesin & Bahasa Utama</span>
              </div>
              <div>
                <strong>2D Pixel RPG</strong>
                <span>Spesialisasi Game</span>
              </div>
            </div>
          </div>

          <div className="hero-visual hero-profile">
            <div className="profile-glow"></div>

            {/* Elemen Dekoratif Khas Game Developer */}
            <div className="profile-floating-badge top-right">🎮</div>
            <div className="profile-decoration left-code">{"func _ready():"}</div>

            <div className="profile-frame">
              {!fotoError ? (
                <img
                  className="profile-photo"
                  src={FOTO_PROFIL}
                  alt="Foto profil Santiago Tan"
                  onError={() => setFotoError(true)}
                />
              ) : (
                <div className="profile-fallback">
                  <span>S</span>
                  <p>Foto profil belum dapat dimuat</p>
                </div>
              )}

              <div className="profile-overlay">
                <span className="profile-status-dot"></span>
                <div>
                  <strong>Santiago Tan</strong>
                  <span>Indie Game Developer · Godot 4</span>
                </div>
              </div>
            </div>

            <div className="floating-card">
              <span className="floating-icon">👾</span>
              <div>
                <strong>Build & Play</strong>
                <span>Merancang game impian.</span>
              </div>
            </div>

            <div className="profile-floating-badge bottom-right">🕹️</div>
          </div>
        </section>

        <section className="about section" id="tentang">
          <div className="section-label">01 / TENTANG SAYA</div>

          <div className="about-content">
            <h2>
              Merangkai logika,
              <br />
              membangun <span>dunia game.</span>
            </h2>

            <div>
              <p>
                Saya adalah pelajar jurusan Rekayasa Perangkat Lunak
                di SMK Bagimu Negeriku, Semarang, yang memiliki gairah besar 
                dalam pembuatan video game. Ketertarikan saya meliputi 
                pemrograman gameplay, sistem AI musuh, hingga perancangan aset pixel art.
              </p>

              <p>
                Dengan menggunakan <strong>Godot Engine</strong> dan GDScript, 
                saya terbiasa merakit mekanik permainan dari nol. Portofolio ini 
                saya dedikasikan untuk memamerkan perjalanan dan karya game indie buatan saya.
              </p>

              <div className="skills">
                <span>Godot Engine</span>
                <span>GDScript</span>
                <span>Pixel Art 2D</span>
                <span>UI / UX Game</span>
                <span>Git & GitHub</span>
                <span>itch.io</span>
              </div>
            </div>
          </div>
        </section>

        <section className="projects section" id="proyek">
          <div className="section-heading">
            <div>
              <div className="section-label">02 / KARYA GAME SAYA</div>
              <h2>Proyek game pilihan<span>.</span></h2>
              <p>Daftar game dan purwarupa interaktif yang telah saya kembangkan.</p>
            </div>

            <span className="project-count">
              {String(projects.length).padStart(2, '0')} GAME
            </span>
          </div>

          {loading && (
            <p className="project-note">Sedang memuat daftar game...</p>
          )}

          {!loading && error && (
            <p className="project-note">{error}</p>
          )}

          {!loading && !error && projects.length === 0 && (
            <p className="project-note">
              Belum ada proyek game. Tambahkan data game ke database
              Supabase agar tampil di sini.
            </p>
          )}

          {!loading && !error && projects.length > 0 && (
            <div className="project-grid">
              {projects.map((project, index) => (
                <article className="project-card" key={project.id}>
                  <div className="project-art">
                    <span className="project-number">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div className="art-shape">
                        {project.category?.toLowerCase().includes('web')
                          ? '〈 / 〉'
                          : '🕹️'}
                      </div>
                    )}

                    <span className="art-caption">
                      {project.category || 'Game 2D'}
                    </span>
                  </div>

                  <div className="project-info">
                    <span className="project-status">
                      {project.category || 'Godot Engine'}
                    </span>

                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    {project.project_url ? (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noreferrer"
                        className="project-link"
                      >
                        Mainkan / Lihat Game <span>↗</span>
                      </a>
                    ) : (
                      <a href="#kontak" className="project-link">
                        Tanya tentang game ini <span>↗</span>
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          <p className="project-note">
            Seluruh proyek game disinkronkan langsung dari database Supabase.
          </p>
        </section>

        <section className="news section" id="kabar">
          <div className="section-label">03 / CATATAN PENGEMBANGAN</div>

          <div className="section-heading">
            <div>
              <h2>Devlog terbaru<span>.</span></h2>
              <p>Catatan kecil seputar proses ngoding dan desain game.</p>
            </div>
          </div>

          <div className="news-card">
            <div className="news-date">
              <span>OKT</span>
              <strong>15</strong>
              <span>2026</span>
            </div>

            <div className="news-content">
              <span className="news-category">PENGEMBANGAN GAME</span>
              <h3>Merilis game 2D Pixel RPG pertama ke itch.io</h3>
              <p>
                Menyempurnakan mekanik pergerakan pemain, transisi tilemap, 
                serta mengatur halaman rilis publik di platform itch.io sebagai developer "Rugo".
              </p>
            </div>

            <span className="news-arrow">↗</span>
          </div>
        </section>

        <section className="contact section" id="kontak">
          <div className="section-label">04 / HUBUNGI SAYA</div>

          <h2>
            Punya ide game seru?
            <br />
            <span>Mari berkolaborasi.</span>
          </h2>

          <p>
            Saya selalu antusias berdiskusi seputar pembuatan game, 
            mekanik gameplay, atau bertukar ilmu pemrograman Godot.
          </p>

          <div className="contact-actions">
            <a
              href="mailto:santiagorpl131009@gmail.com"
              className="primary-button"
            >
              Kirim Email ↗
            </a>

            <a
              href="https://wa.me/6282195134678"
              target="_blank"
              rel="noreferrer"
              className="secondary-button"
            >
              Hubungi via WhatsApp ↗
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <a href="#beranda" className="brand">
          <span className="brand-icon">S</span>
          <span>Santiago<span className="brand-dot">.</span></span>
        </a>

        <p>
          Dibuat dengan semangat ngoding, pixel art, dan kecintaan pada dunia game.
        </p>

        <span>© 2026 Santiago Tan</span>
      </footer>
    </div>
  )
}

export default App