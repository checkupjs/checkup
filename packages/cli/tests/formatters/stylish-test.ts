import { CheckupLogParser, FormatterOptions } from '@checkup/core';
import stripAnsi from 'strip-ansi';
import StylishFormatter from '../../src/formatters/stylish.js';
import { getFixture } from '../__utils__/get-fixture.js';

describe('Stylish formatter', () => {
  it('can generate string from format', async () => {
    const log = getFixture('checkup-result-short.sarif');
    const logParser = new CheckupLogParser(log);
    const options: FormatterOptions = {
      cwd: '',
      format: 'stylish',
    };

    let formatter = new StylishFormatter(options);

    const result = stripAnsi(formatter.format(logParser));

    expect(result).toMatchInlineSnapshot(`
      "
      app/components/feature-toggle.js
        0:0  metrics  Located component at app/components/feature-toggle.js  ember-types

      app/components/flash-display.js
        0:0  metrics  Located component at app/components/flash-display.js  ember-types

      app/components/flash-item.js
        0:0  metrics  Located component at app/components/flash-item.js  ember-types

      app/components/forms/form-checkbox.js
        0:0  metrics  Located component at app/components/forms/form-checkbox.js  ember-types

      app/components/forms/form-field.js
        0:0  metrics  Located component at app/components/forms/form-field.js  ember-types

      app/components/forms/form-input.js
        0:0  metrics  Located component at app/components/forms/form-input.js  ember-types

      app/components/forms/form-select-multiple.js
        0:0  metrics  Located component at app/components/forms/form-select-multiple.js  ember-types

      app/components/forms/form-select.js
        0:0  metrics  Located component at app/components/forms/form-select.js  ember-types

      app/components/forms/form-slider.js
        0:0  metrics  Located component at app/components/forms/form-slider.js  ember-types

      app/components/forms/form-switch.js
        0:0  metrics  Located component at app/components/forms/form-switch.js  ember-types

      app/components/forms/form-textarea.js
        0:0  metrics  Located component at app/components/forms/form-textarea.js  ember-types

      app/components/forms/multiple-inputs-field.js
        0:0  metrics  Located component at app/components/forms/multiple-inputs-field.js  ember-types

      app/components/getting-started-step.js
        0:0  metrics  Located component at app/components/getting-started-step.js  ember-types

      app/components/getting-started-steps-generic.js
        0:0  metrics  Located component at app/components/getting-started-steps-generic.js  ember-types

      app/components/github-apps-repository.js
        0:0  metrics  Located component at app/components/github-apps-repository.js  ember-types

      app/components/header-broadcasts.js
        0:0  metrics  Located component at app/components/header-broadcasts.js  ember-types

      app/components/header-burger-menu.js
        0:0  metrics  Located component at app/components/header-burger-menu.js  ember-types

      app/components/header-links.js
        0:0  metrics  Located component at app/components/header-links.js  ember-types

      app/components/insights-date-display.js
        0:0  metrics  Located component at app/components/insights-date-display.js  ember-types

      app/components/insights-glance.js
        0:0  metrics  Located component at app/components/insights-glance.js  ember-types

      app/components/insights-overlay.js
        0:0  metrics  Located component at app/components/insights-overlay.js  ember-types

      app/components/insights-privacy-selector.js
        0:0  metrics  Located component at app/components/insights-privacy-selector.js  ember-types

      app/components/insights-tabs.js
        0:0  metrics  Located component at app/components/insights-tabs.js  ember-types

      app/components/job-infrastructure-notification.js
        0:0  metrics  Located component at app/components/job-infrastructure-notification.js  ember-types

      app/components/job-log.js
        0:0  metrics  Located component at app/components/job-log.js  ember-types

      app/components/job-tabs.js
        0:0  metrics  Located component at app/components/job-tabs.js  ember-types

      app/components/job-wrapper.js
        0:0  metrics  Located component at app/components/job-wrapper.js  ember-types

      app/components/jobs-item.js
        0:0  metrics  Located component at app/components/jobs-item.js  ember-types

      app/components/jobs-list.js
        0:0  metrics  Located component at app/components/jobs-list.js  ember-types

      app/components/landing-default-page.js
        0:0  metrics  Located component at app/components/landing-default-page.js  ember-types

      app/components/landing-pro-page.js
        0:0  metrics  Located component at app/components/landing-pro-page.js  ember-types

      app/components/lastbuild-tile.js
        0:0  metrics  Located component at app/components/lastbuild-tile.js  ember-types

      app/components/layouts/sidebar.js
        0:0  metrics  Located component at app/components/layouts/sidebar.js  ember-types

      app/components/layouts/striped-section.js
        0:0  metrics  Located component at app/components/layouts/striped-section.js  ember-types

      app/components/layouts/striped.js
        0:0  metrics  Located component at app/components/layouts/striped.js  ember-types

      app/components/limit-concurrent-builds.js
        0:0  metrics  Located component at app/components/limit-concurrent-builds.js  ember-types

      app/components/link-to-account.js
        0:0  metrics  Located component at app/components/link-to-account.js  ember-types

      app/components/load-more.js
        0:0  metrics  Located component at app/components/load-more.js  ember-types

      app/components/loading-indicator.js
        0:0  metrics  Located component at app/components/loading-indicator.js  ember-types

      app/components/loading-overlay.js
        0:0  metrics  Located component at app/components/loading-overlay.js  ember-types

      app/components/loading-page.js
        0:0  metrics  Located component at app/components/loading-page.js  ember-types

      app/components/loading-screen.js
        0:0  metrics  Located component at app/components/loading-screen.js  ember-types

      app/components/log-content.js
        0:0  metrics  Located component at app/components/log-content.js  ember-types

      app/components/manual-subscription-help.js
        0:0  metrics  Located component at app/components/manual-subscription-help.js  ember-types

      app/components/migration-banner.js
        0:0  metrics  Located component at app/components/migration-banner.js  ember-types

      app/components/modal.js
        0:0  metrics  Located component at app/components/modal.js  ember-types

      app/components/multi-signin-button.js
        0:0  metrics  Located component at app/components/multi-signin-button.js  ember-types

      app/components/my-build.js
        0:0  metrics  Located component at app/components/my-build.js  ember-types

      app/components/new-subscription-button.js
        0:0  metrics  Located component at app/components/new-subscription-button.js  ember-types

      app/components/no-repos.js
        0:0  metrics  Located component at app/components/no-repos.js  ember-types

      app/components/not-active.js
        0:0  metrics  Located component at app/components/not-active.js  ember-types

      app/components/org-item.js
        0:0  metrics  Located component at app/components/org-item.js  ember-types

      app/components/oss-usage-digit.js
        0:0  metrics  Located component at app/components/oss-usage-digit.js  ember-types

      app/components/oss-usage-numbers.js
        0:0  metrics  Located component at app/components/oss-usage-numbers.js  ember-types

      app/components/overlay-backdrop.js
        0:0  metrics  Located component at app/components/overlay-backdrop.js  ember-types

      app/components/owner-not-found.js
        0:0  metrics  Located component at app/components/owner-not-found.js  ember-types

      app/components/owner-repo-tile.js
        0:0  metrics  Located component at app/components/owner-repo-tile.js  ember-types

      app/components/owner-sync-button.js
        0:0  metrics  Located component at app/components/owner-sync-button.js  ember-types

      app/components/owner/migrate.js
        0:0  metrics  Located component at app/components/owner/migrate.js  ember-types

      app/components/owner/repositories.js
        0:0  metrics  Located component at app/components/owner/repositories.js  ember-types

      app/components/page-footer.js
        0:0  metrics  Located component at app/components/page-footer.js  ember-types

      app/components/pagination-navigation.js
        0:0  metrics  Located component at app/components/pagination-navigation.js  ember-types

      app/components/paper-block.js
        0:0  metrics  Located component at app/components/paper-block.js  ember-types

      app/components/plan-usage.js
        0:0  metrics  Located component at app/components/plan-usage.js  ember-types

      app/components/profile-accounts-wrapper.js
        0:0  metrics  Located component at app/components/profile-accounts-wrapper.js  ember-types

      app/components/profile-menu.js
        0:0  metrics  Located component at app/components/profile-menu.js  ember-types

      app/components/profile-nav.js
        0:0  metrics  Located component at app/components/profile-nav.js  ember-types

      app/components/queue-times.js
        0:0  metrics  Located component at app/components/queue-times.js  ember-types

      app/components/queued-jobs.js
        0:0  metrics  Located component at app/components/queued-jobs.js  ember-types

      app/components/raw-config.js
        0:0  metrics  Located component at app/components/raw-config.js  ember-types

      app/components/remove-log-popup.js
        0:0  metrics  Located component at app/components/remove-log-popup.js  ember-types

      app/components/repo-actions.js
        0:0  metrics  Located component at app/components/repo-actions.js  ember-types

      app/components/repo-build-list.js
        0:0  metrics  Located component at app/components/repo-build-list.js  ember-types

      app/components/repo-not-found.js
        0:0  metrics  Located component at app/components/repo-not-found.js  ember-types

      app/components/repo-show-tabs.js
        0:0  metrics  Located component at app/components/repo-show-tabs.js  ember-types

      app/components/repo-show-tools.js
        0:0  metrics  Located component at app/components/repo-show-tools.js  ember-types

      app/components/repo-status-badge.js
        0:0  metrics  Located component at app/components/repo-status-badge.js  ember-types

      app/components/repo-wrapper.js
        0:0  metrics  Located component at app/components/repo-wrapper.js  ember-types

      app/components/repos-list-item.js
        0:0  metrics  Located component at app/components/repos-list-item.js  ember-types

      app/components/repos-list-tabs.js
        0:0  metrics  Located component at app/components/repos-list-tabs.js  ember-types

      app/components/repos-list.js
        0:0  metrics  Located component at app/components/repos-list.js  ember-types

      app/components/repository-filter-form.js
        0:0  metrics  Located component at app/components/repository-filter-form.js  ember-types

      app/components/repository-filter.js
        0:0  metrics  Located component at app/components/repository-filter.js  ember-types

      app/components/repository-layout.js
        0:0  metrics  Located component at app/components/repository-layout.js  ember-types

      app/components/repository-migration-modal.js
        0:0  metrics  Located component at app/components/repository-migration-modal.js  ember-types

      app/components/repository-sidebar.js
        0:0  metrics  Located component at app/components/repository-sidebar.js  ember-types

      app/components/repository-status-toggle.js
        0:0  metrics  Located component at app/components/repository-status-toggle.js  ember-types

      app/components/request-config.js
        0:0  metrics  Located component at app/components/request-config.js  ember-types

      app/components/request-icon.js
        0:0  metrics  Located component at app/components/request-icon.js  ember-types

      app/components/requests-item.js
        0:0  metrics  Located component at app/components/requests-item.js  ember-types

      app/components/running-jobs-item.js
        0:0  metrics  Located component at app/components/running-jobs-item.js  ember-types

      app/components/running-jobs.js
        0:0  metrics  Located component at app/components/running-jobs.js  ember-types

      app/components/sales-contact-form.js
        0:0  metrics  Located component at app/components/sales-contact-form.js  ember-types

      app/components/sales-contact-thanks.js
        0:0  metrics  Located component at app/components/sales-contact-thanks.js  ember-types

      app/components/scroll-here.js
        0:0  metrics  Located component at app/components/scroll-here.js  ember-types

      app/components/settings-switch.js
        0:0  metrics  Located component at app/components/settings-switch.js  ember-types

      app/components/show-more-button.js
        0:0  metrics  Located component at app/components/show-more-button.js  ember-types

      app/components/ssh-key.js
        0:0  metrics  Located component at app/components/ssh-key.js  ember-types

      app/components/status-icon.js
        0:0  metrics  Located component at app/components/status-icon.js  ember-types

      app/components/status-image-input.js
        0:0  metrics  Located component at app/components/status-image-input.js  ember-types

      app/components/status-images.js
        0:0  metrics  Located component at app/components/status-images.js  ember-types

      app/components/subscribe-button.js
        0:0  metrics  Located component at app/components/subscribe-button.js  ember-types

      app/components/subscription-status-banner.js
        0:0  metrics  Located component at app/components/subscription-status-banner.js  ember-types

      app/components/svg-image.js
        0:0  metrics  Located component at app/components/svg-image.js  ember-types

      app/components/sync-button.js
        0:0  metrics  Located component at app/components/sync-button.js  ember-types

      app/components/top-bar.js
        0:0  metrics  Located component at app/components/top-bar.js  ember-types

      app/components/top-forum-post-list.js
        0:0  metrics  Located component at app/components/top-forum-post-list.js  ember-types

      app/components/travis-form.js
        0:0  metrics  Located component at app/components/travis-form.js  ember-types

      app/components/travis-layout.js
        0:0  metrics  Located component at app/components/travis-layout.js  ember-types

      app/components/travis-status.js
        0:0  metrics  Located component at app/components/travis-status.js  ember-types

      app/components/travis-switch.js
        0:0  metrics  Located component at app/components/travis-switch.js  ember-types

      app/components/trigger-custom-build.js
        0:0  metrics  Located component at app/components/trigger-custom-build.js  ember-types

      app/components/ui-kit/badge.js
        0:0  metrics  Located component at app/components/ui-kit/badge.js  ember-types

      app/components/ui-kit/box.js
        0:0  metrics  Located component at app/components/ui-kit/box.js  ember-types

      app/components/ui-kit/button-signin.js
        0:0  metrics  Located component at app/components/ui-kit/button-signin.js  ember-types

      app/components/ui-kit/button.js
        0:0  metrics  Located component at app/components/ui-kit/button.js  ember-types

      app/components/ui-kit/code.js
        0:0  metrics  Located component at app/components/ui-kit/code.js  ember-types

      app/components/ui-kit/grid-item.js
        0:0  metrics  Located component at app/components/ui-kit/grid-item.js  ember-types

      app/components/ui-kit/grid.js
        0:0  metrics  Located component at app/components/ui-kit/grid.js  ember-types

      app/components/ui-kit/image.js
        0:0  metrics  Located component at app/components/ui-kit/image.js  ember-types

      app/components/ui-kit/link.js
        0:0  metrics  Located component at app/components/ui-kit/link.js  ember-types

      app/components/ui-kit/note.js
        0:0  metrics  Located component at app/components/ui-kit/note.js  ember-types

      app/components/ui-kit/switch.js
        0:0  metrics  Located component at app/components/ui-kit/switch.js  ember-types

      app/components/ui-kit/text.js
        0:0  metrics  Located component at app/components/ui-kit/text.js  ember-types

      app/components/user-avatar.js
        0:0  metrics  Located component at app/components/user-avatar.js  ember-types

      app/components/visibility-setting-list.js
        0:0  metrics  Located component at app/components/visibility-setting-list.js  ember-types

      app/components/x-tracer.js
        0:0  metrics  Located component at app/components/x-tracer.js  ember-types

      app/components/zendesk-request-form.js
        0:0  metrics  Located component at app/components/zendesk-request-form.js  ember-types

      app/mixins/components/form-select.js
        0:0  metrics  Located component at app/mixins/components/form-select.js  ember-types

      app/mixins/components/with-config-validation.js
        0:0  metrics  Located component at app/mixins/components/with-config-validation.js  ember-types

      tests/integration/components/active-repo-count-test.js
        0:0  metrics  Located component at tests/integration/components/active-repo-count-test.js  ember-types

      tests/integration/components/add-env-var-test.js
        0:0  metrics  Located component at tests/integration/components/add-env-var-test.js  ember-types

      tests/integration/components/add-ssh-key-test.js
        0:0  metrics  Located component at tests/integration/components/add-ssh-key-test.js  ember-types

      tests/integration/components/beta-feature-test.js
        0:0  metrics  Located component at tests/integration/components/beta-feature-test.js  ember-types

      tests/integration/components/billing-summary-status-test.js
        0:0  metrics  Located component at tests/integration/components/billing-summary-status-test.js  ember-types

      tests/integration/components/billing/address-test.js
        0:0  metrics  Located component at tests/integration/components/billing/address-test.js  ember-types

      tests/integration/components/billing/information-test.js
        0:0  metrics  Located component at tests/integration/components/billing/information-test.js  ember-types

      tests/integration/components/billing/invoices-test.js
        0:0  metrics  Located component at tests/integration/components/billing/invoices-test.js  ember-types

      tests/integration/components/billing/payment-test.js
        0:0  metrics  Located component at tests/integration/components/billing/payment-test.js  ember-types

      tests/integration/components/billing/process-test.js
        0:0  metrics  Located component at tests/integration/components/billing/process-test.js  ember-types

      tests/integration/components/billing/select-addon-test.js
        0:0  metrics  Located component at tests/integration/components/billing/select-addon-test.js  ember-types

      tests/integration/components/billing/select-plan-test.js
        0:0  metrics  Located component at tests/integration/components/billing/select-plan-test.js  ember-types

      tests/integration/components/billing/selected-addon-test.js
        0:0  metrics  Located component at tests/integration/components/billing/selected-addon-test.js  ember-types

      tests/integration/components/billing/selected-plan-test.js
        0:0  metrics  Located component at tests/integration/components/billing/selected-plan-test.js  ember-types

      tests/integration/components/billing/summary-test.js
        0:0  metrics  Located component at tests/integration/components/billing/summary-test.js  ember-types

      tests/integration/components/billing/warning-message-test.js
        0:0  metrics  Located component at tests/integration/components/billing/warning-message-test.js  ember-types

      tests/integration/components/branch-row-test.js
        0:0  metrics  Located component at tests/integration/components/branch-row-test.js  ember-types

      tests/integration/components/build-count-test.js
        0:0  metrics  Located component at tests/integration/components/build-count-test.js  ember-types

      tests/integration/components/build-header-test.js
        0:0  metrics  Located component at tests/integration/components/build-header-test.js  ember-types

      app/helpers/format-message.js
        0:0  metrics  Located helper at app/helpers/format-message.js  ember-types

      app/helpers/format-number.js
        0:0  metrics  Located helper at app/helpers/format-number.js  ember-types

      /Users/zhanwang/personal/travis-web/package.json
        90:4  dependencies  Ember dependency information for ember-web-app      ember-dependencies
        91:4  dependencies  Ember dependency information for ember-window-mock  ember-dependencies

      ✅ 153 results (metrics 151, dependencies 2)
      "
    `);
  });
});
