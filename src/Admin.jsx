import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import './Admin.css'

const ADMIN_ID = 'd4f05698-b70c-450f-876c-f6575a07c580'

function Admin() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loggingIn, setLoggingIn] = useState(false)
  const [saving, setSaving] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const [projects, setProjects] = useState([])
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    project_url: '',
  })

  const isAdmin = session?.user?.id === ADMIN_ID

  useEffect(() => {
    let aktif = true

    async function checkSession() {
      const { data, error } = await supabase.auth.getSession()

      if (!aktif) return

      if (error) {
        setError(error.message)
      }

      const currentSession = data?.session ?? null

      if (currentSession?.user?.id === ADMIN_ID) {
        setSession(currentSession)
      } else {
        setSession(null)

        if (currentSession) {
          await supabase.auth.signOut()
        }
      }

      if (aktif) setLoading(false)
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!aktif) return

      if (newSession?.user?.id === ADMIN_ID) {
        setSession(newSession)
      } else {
        setSession(null)
      }
    })

    return () => {
      aktif = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (isAdmin) {
      getProjects()
    }
  }, [isAdmin])

  async function getProjects() {
    setError('')

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      setError('Gagal mengambil proyek: ' + error.message)
      return
    }

    setProjects(data ?? [])
  }

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoggingIn(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Login gagal. Periksa email dan password kamu.')
      setLoggingIn(false)
      return
    }

    if (data.user?.id !== ADMIN_ID) {
      await supabase.auth.signOut()
      setError('Akun ini tidak memiliki akses admin.')
      setLoggingIn(false)
      return
    }

    setSession(data.session)
    setPassword('')
    setMessage('Login berhasil! Selamat datang di dashboard admin.')
    setLoggingIn(false)
  }

  function handleChange(e) {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    const projectData = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      image_url: form.image_url.trim() || null,
      project_url: form.project_url.trim() || null,
    }

    let result

    if (editingId) {
      result = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingId)
        .select()
    } else {
      result = await supabase
        .from('projects')
        .insert([projectData])
        .select()
    }

    if (result.error) {
      setError('Gagal menyimpan proyek: ' + result.error.message)
      setSaving(false)
      return
    }

    setMessage(
      editingId
        ? 'Proyek berhasil diperbarui!'
        : 'Proyek berhasil ditambahkan!'
    )

    resetForm()
    await getProjects()
    setSaving(false)
  }

  function handleEdit(project) {
    setEditingId(project.id)

    setForm({
      title: project.title ?? '',
      description: project.description ?? '',
      category: project.category ?? '',
      image_url: project.image_url ?? '',
      project_url: project.project_url ?? '',
    })

    setError('')
    setMessage('Silakan ubah data proyek di formulir.')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id) {
    const yakin = window.confirm(
      'Apakah kamu yakin ingin menghapus proyek ini?'
    )

    if (!yakin) return

    setError('')
    setMessage('')

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      setError('Gagal menghapus proyek: ' + error.message)
      return
    }

    setMessage('Proyek berhasil dihapus!')

    if (editingId === id) {
      resetForm()
    }

    await getProjects()
  }

  function resetForm() {
    setEditingId(null)

    setForm({
      title: '',
      description: '',
      category: '',
      image_url: '',
      project_url: '',
    })
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      setError('Gagal keluar: ' + error.message)
      return
    }

    setSession(null)
    setProjects([])
    setPassword('')
    setEmail('')
    setError('')
    setMessage('Kamu sudah keluar dari akun admin.')
  }

  if (loading) {
    return (
      <main className="admin-page">
        <p>Memeriksa sesi login...</p>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="admin-page">
        <form className="admin-login" onSubmit={handleLogin}>
          <a className="admin-back" href="/">
            ← Kembali ke Portofolio
          </a>

          <p className="admin-label">HALAMAN KHUSUS</p>
          <h1>Login Admin</h1>

          <p className="admin-description">
            Masuk untuk mengelola proyek portofolio kamu.
          </p>

          {error && (
            <p className="admin-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="admin-message">
              {message}
            </p>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email admin"
            autoComplete="username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password admin"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            className="admin-button"
            disabled={loggingIn}
          >
            {loggingIn ? 'Memeriksa...' : 'Masuk'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="admin-page">
      <section className="admin-dashboard">
        <header className="admin-header">
          <div>
            <p className="admin-label">PANEL PENGELOLAAN</p>
            <h1>Dashboard Admin</h1>
            <p className="admin-description">
              Kelola proyek yang tampil di portofolio kamu.
            </p>
          </div>

          <button
            type="button"
            className="admin-button"
            onClick={handleLogout}
          >
            Keluar
          </button>
        </header>

        {error && (
          <p className="admin-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <p className="admin-message">
            {message}
          </p>
        )}

        <section className="admin-panel">
          <h2>{editingId ? 'Edit Proyek' : 'Tambah Proyek'}</h2>

          <form className="admin-project-form" onSubmit={handleSave}>
            <label htmlFor="title">Nama Proyek</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Contoh: Game RPG Pixel"
              required
            />

            <label htmlFor="description">Deskripsi</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Jelaskan proyek kamu"
              rows="4"
              required
            />

            <label htmlFor="category">Kategori</label>
            <input
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Contoh: Game Development"
              required
            />

            <label htmlFor="image_url">URL Gambar</label>
            <input
              id="image_url"
              name="image_url"
              type="url"
              value={form.image_url}
              onChange={handleChange}
              placeholder="https://contoh.com/gambar.png"
            />

            <label htmlFor="project_url">URL Proyek</label>
            <input
              id="project_url"
              name="project_url"
              type="url"
              value={form.project_url}
              onChange={handleChange}
              placeholder="https://github.com/username/proyek"
            />

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-button"
                disabled={saving}
              >
                {saving
                  ? 'Menyimpan...'
                  : editingId
                    ? 'Simpan Perubahan'
                    : 'Tambah Proyek'}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="admin-button"
                  onClick={resetForm}
                >
                  Batal Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="admin-panel">
          <div className="admin-list-header">
            <h2>Daftar Proyek</h2>

            <button
              type="button"
              className="admin-button"
              onClick={getProjects}
            >
              Muat Ulang
            </button>
          </div>

          <p className="admin-description">
            Jumlah proyek: {projects.length}
          </p>

          {projects.length === 0 ? (
            <p>Belum ada proyek. Kamu bisa menambahkan proyek di atas.</p>
          ) : (
            <div className="admin-project-list">
              {projects.map((project) => (
                <article
                  className="admin-project-card"
                  key={project.id}
                >
                  {project.image_url && (
                    <img
                      className="admin-project-image"
                      src={project.image_url}
                      alt={project.title}
                    />
                  )}

                  <div className="admin-project-info">
                    <p className="admin-label">
                      {project.category}
                    </p>

                    <h3>{project.title}</h3>

                    <p>{project.description}</p>

                    {project.project_url && (
                      <a
                        href={project.project_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Lihat Proyek ↗
                      </a>
                    )}

                    <div className="admin-form-actions">
                      <button
                        type="button"
                        className="admin-button"
                        onClick={() => handleEdit(project)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="admin-button"
                        onClick={() => handleDelete(project.id)}
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <a className="admin-back" href="/">
          ← Lihat Portofolio
        </a>
      </section>
    </main>
  )
}

export default Admin
