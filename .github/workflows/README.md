# GitHub Actions Workflows

## 🔄 CI/CD Pipeline

### `ci.yml` - Continuous Integration
**Käivitub:** Iga `push` main/develop branchile või pull request

**Teeb:**
1. ✅ Kompileerib backend TypeScript
2. ✅ Kompileerib desktop TypeScript
3. ✅ Kontrollib lint erroreid
4. ✅ Buildib Electron installeri
5. ✅ Uploadib installer artifactina (30 päevaks)

**Artifact allalaadimine:**
- Mine Actions tab → Vali workflow run → Scroll alla → "Artifacts"

---

### `release.yml` - Release Automation
**Käivitub:** Kui push-id Git tag (nt `v1.3.0`)

**Teeb:**
1. ✅ Buildib production installer
2. ✅ Loob GitHub Release
3. ✅ Uploadib installer Release-sse
4. ✅ Genereerib release notes automaatselt

**Kasutamine:**
```bash
git tag -a v1.4.0 -m "Release v1.4.0"
git push --tags
```

---

## 📊 Status Badge

Lisa README.md-sse:
```markdown
![CI Status](https://github.com/USERNAME/REPO/actions/workflows/ci.yml/badge.svg)
```

---

## 🐛 Troubleshooting

**Error: "npm ci failed"**
- Kontrolli, et `package-lock.json` on commititud

**Error: "electron-builder failed"**
- Kontrolli, et `package.json` build config on õige
- Vaata logs-ist täpset error messaget

**Artifact puudub:**
- Workflow peab olema lõpetanud edukalt
- Artifact säilib 30 päeva

