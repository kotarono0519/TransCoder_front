import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSelect from '~/components/LanguageSelect.vue'
import { SUPPORTED_LANGUAGES } from '~/types'

describe('LanguageSelect', () => {
  it('renders all language options', () => {
    const wrapper = mount(LanguageSelect, {
      props: {
        modelValue: 'auto',
        languages: SUPPORTED_LANGUAGES
      }
    })

    const options = wrapper.findAll('option')
    expect(options).toHaveLength(SUPPORTED_LANGUAGES.length)
  })

  it('emits update:modelValue when selection changes', async () => {
    const wrapper = mount(LanguageSelect, {
      props: {
        modelValue: 'auto',
        languages: SUPPORTED_LANGUAGES
      }
    })

    const select = wrapper.find('select')
    await select.setValue('python')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['python'])
  })

  it('displays correct selected value', () => {
    const wrapper = mount(LanguageSelect, {
      props: {
        modelValue: 'javascript',
        languages: SUPPORTED_LANGUAGES
      }
    })

    const select = wrapper.find('select')
    expect((select.element as HTMLSelectElement).value).toBe('javascript')
  })
})