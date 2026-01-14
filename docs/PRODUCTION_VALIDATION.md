# Production Validation Checklist

## Pre-Deployment

### Environment Variables

Verify all required environment variables are set in Vercel dashboard:

- [ ] `DATABASE_URL` (PostgreSQL pooled connection)
- [ ] `DIRECT_URL` (PostgreSQL direct connection for migrations)
- [ ] `NEXTAUTH_SECRET` (Generate with: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` (Production URL: `https://caminhos-campinas.vercel.app`)
- [ ] `NODE_ENV=production`

### Database

- [ ] Run Prisma migrations: `npx prisma migrate deploy`
- [ ] Generate Prisma client: `npx prisma generate`
- [ ] Verify connection: `npx prisma studio` (local test)
- [ ] Check indexes exist on Partner, Post, DilemmaFeedback models

### Code Quality

- [ ] Type check passes: `npm run type-check`
- [ ] Linter passes: `npm run lint`
- [ ] Build completes: `npm run build`
- [ ] No console errors in production build

---

## Deployment

### Vercel Deployment

```bash
# Deploy to production
vercel --prod

# Monitor deployment
vercel logs --follow
```

### Post-Deployment Checks

- [ ] Homepage loads: `https://caminhos-campinas.vercel.app`
- [ ] Game starts without errors
- [ ] Partner registration form works
- [ ] No 404 errors on static assets
- [ ] Service Worker registers successfully

---

## Health Checks

### API Health

Test all critical endpoints:

```bash
# Partner creation
curl -X POST https://caminhos-campinas.vercel.app/api/partners \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","category":"NGO"}'

# Expected: 201 Created with requestId

# Partner listing
curl https://caminhos-campinas.vercel.app/api/partners

# Expected: 200 OK with partners array
```

### Database Health

- [ ] Database responds to queries (check Vercel logs)
- [ ] No connection pool exhaustion warnings
- [ ] Response times < 500ms average

### IndexedDB

- [ ] Open DevTools → Application → IndexedDB
- [ ] Verify `pop_rua_game_db` database exists
- [ ] Play game for 5 minutes, verify state persists
- [ ] Refresh page, verify game state restored
- [ ] No AbortError in console

---

## Monitoring Setup

### Sentry (Error Tracking)

- [ ] Verify Sentry DSN configured
- [ ] Test error capture: Trigger intentional error
- [ ] Check Sentry dashboard for captured error
- [ ] Set up email alerts for critical errors

### Vercel Analytics

- [ ] Verify analytics script loads
- [ ] Check real-time visitors in Vercel dashboard
- [ ] Monitor Core Web Vitals
- [ ] Set up performance budget alerts

### Logs

- [ ] Check Vercel logs for no critical errors
- [ ] Verify request IDs appear in all API logs
- [ ] Database health checks logging correctly
- [ ] No quota warnings from IndexedDB

---

## Performance Validation

### Lighthouse Audit

Target scores:
- Performance: > 90
- Accessibility: > 95
- Best Practices: > 90
- SEO: > 90

```bash
# Run Lighthouse
npx lighthouse https://caminhos-campinas.vercel.app --view
```

### Key Metrics

- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Time to Interactive < 3.5s
- [ ] Cumulative Layout Shift < 0.1

---

## Security Validation

### Input Validation

- [ ] Test invalid partner data (missing required fields)
- [ ] Test XSS in partner description field
- [ ] Test SQL injection attempts (should be blocked by Prisma)
- [ ] Verify no stack traces in production error responses

### Headers

- [ ] Verify CSP headers present
- [ ] Check X-Frame-Options set
- [ ] Verify X-Content-Type-Options: nosniff

---

## Functional Testing

### Critical User Flows

1. **New Game Start**
   - [ ] Avatar creation works
   - [ ] Intro dilemma appears
   - [ ] Time-based meal options accurate (Bom Prato hours)
   - [ ] Stats update correctly

2. **Story Arc Progression**
   - [ ] Dilemmas trigger based on arc
   - [ ] Thematic coherence maintained
   - [ ] Cross-arc dependencies work

3. **Partner Registration**
   - [ ] Form validation works
   - [ ] Success message appears
   - [ ] Partner appears in database (check Prisma Studio)

4. **Offline Mode**
   - [ ] Disconnect network
   - [ ] App still loads from cache
   - [ ] Game continues to work
   - [ ] State persists in IndexedDB

---

## Rollback Procedure

If critical issues are detected:

1. **Immediate:**
   ```bash
   # Rollback to previous deployment
   vercel rollback
   ```

2. **Investigation:**
   - Check Vercel logs for error patterns
   - Review Sentry for stack traces
   - Verify database migrations didn't break schema

3. **Communication:**
   - Update status page (if exists)
   - Notify users via social media
   - Document incident in postmortem

---

## Sign-Off

| Check | Date | Verified By |
|-------|------|-------------|
| Environment variables | ____ | __________ |
| Database migration | ____ | __________ |
| API health checks | ____ | __________ |
| IndexedDB resilience | ____ | __________ |
| Performance metrics | ____ | __________ |
| Security validation | ____ | __________ |
| Functional testing | ____ | __________ |

**Deployment approved:** ☐ Yes ☐ No

**Notes:**
```
[Document any issues or deviations from checklist]
```

---

## Post-Deployment Monitoring

### First 24 Hours

- [ ] Monitor error rate (should be < 1%)
- [ ] Check API response times (should be < 500ms avg)
- [ ] Review user feedback channels
- [ ] Monitor database connection pool usage

### First Week

- [ ] Review Sentry for new error patterns
- [ ] Analyze user flow drop-offs
- [ ] Check IndexedDB quota warnings
- [ ] Gather partner registration feedback

---

## Emergency Contacts

- **Database Issues**: [Contact Vercel Postgres support]
- **Hosting Issues**: [Vercel support ticket]
- **Application Owner**: [Your contact info]

---

**Last Updated:** 2026-01-14  
**Version:** 1.0.0
